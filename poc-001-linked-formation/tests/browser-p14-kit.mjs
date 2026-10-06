// Additive P14 check. Existing browser suites and their runner stay unchanged.
// Usage: bun tests/browser-p14-kit.mjs CHROME OUTPUT [BASE_URL].
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createPatrol } from '../src/content/patrol.ts';
import { ABILITIES } from '../src/content/brood.ts';
import { DEFAULT_ABILITY_RULES } from '../src/core/abilities.ts';
import { applyCommand } from '../src/core/transition.ts';
import { previewCommand } from '../src/core/preview.ts';
import { replayRun } from '../src/core/run-record.ts';
import { kitFixture } from './browser/p14-fixtures.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME and OUTPUT required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p14-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9238', `--user-data-dir=${profile}`, 'about:blank']);
let socket, assertions = 0, document;
const exceptions = [], evidence = [], pause = ms => new Promise(done => setTimeout(done, ms));
const equal = (a, b, label) => { assertions++; assert.deepEqual(a, b, label); };
const check = (value, label) => { assertions++; assert(value, label); };
const hpText = state => [...state.brood, ...state.enemies].map(e => `${e.id[0].toUpperCase()+e.id.slice(1)} ${e.hp}/${e.maxHp}`).join(' · ');
try {
  let tab;
  for (let i = 0; i < 150; i++) {
    try { tab = await (await fetch('http://localhost:9238/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { if (chrome.exitCode !== null) throw new Error('Chrome exited'); await pause(100); }
  }
  check(tab, 'Chrome started'); socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const number = ++id; pending.set(number, { resolve, reject }); socket.send(JSON.stringify({ id: number, method, params }));
  });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { const callback = pending.get(message.id); pending.delete(message.id);
      message.error ? callback.reject(message.error) : callback.resolve(message.result); }
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    else if (message.method === 'Fetch.requestPaused') cdp('Fetch.fulfillRequest', {
      requestId: message.params.requestId, responseCode: 200,
      responseHeaders: [{ name: 'Content-Type', value: 'text/html' }], body: Buffer.from(document).toString('base64'),
    }).catch(error => exceptions.push(error));
  };
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function waitFor(expression) {
    for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await pause(50); }
    throw new Error(`Timeout: ${expression}`);
  }
  async function click(selector) {
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest'})`);
    const point = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
  }
  const settled = () => waitFor(`document.querySelector('#patrol').dataset.busy==='false'`);
  const snapshot = () => evaluate(`(()=>({revision:Number(document.querySelector('#patrol').dataset.revision),
    rule:document.querySelector('#ability-rule').textContent, preview:document.querySelector('#projection').textContent,
    hp:[...document.querySelectorAll('[data-entity]')].map(e=>({id:e.dataset.entity,hp:Number(e.dataset.hp)})),
    shelters:document.querySelector('#shelters').textContent}))()`);
  function matches(actual, state) {
    equal(actual.revision, state.revision, 'visible revision matches core');
    equal(actual.hp, [...state.brood, ...state.enemies].map(({ id, hp }) => ({ id, hp })), 'visible HP matches core');
  }
  async function capture(name) {
    const { cssContentSize: size } = await cdp('Page.getLayoutMetrics');
    const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } });
    await writeFile(join(output, name), Buffer.from(result.data, 'base64'));
  }
  async function select(state, abilityId, actorId, targetId, screenshot) {
    const command = { kind: 'useAbility', expectedRevision: state.revision, abilityId, actorId, targetId };
    const preview = previewCommand(state, command, 0); check(preview.ok, 'core accepts ability');
    await click(`[data-actor="${actorId}"]`);
    check(!await evaluate(`document.querySelector('[data-ability="${abilityId}"]').disabled`), 'ability enabled');
    await click(`[data-ability="${abilityId}"]`); await click(`[data-target="${targetId}"]`);
    const actual = await snapshot(); matches(actual, state);
    const amount = abilityId === 'shelter' ? `Reduce by up to ${state.patrolRules.damageRules.shelterReduction}.`
      : `Damage ${ABILITIES[abilityId].damage}.`;
    equal(actual.rule, `${ABILITIES[abilityId].summary} ${amount}`, 'rule line reads owners');
    check(actual.preview.includes(`Immediate: ${hpText(preview.state)} · ${preview.state.phase}.`), 'immediate preview agrees');
    check(preview.forecast.kind === 'transition' && preview.forecast.ok, 'forecast available');
    check(actual.preview.includes(`If end phase now: ${hpText(preview.forecast.state)} · ${preview.forecast.state.phase}.`), 'forecast agrees');
    if (abilityId === 'shelter') check(actual.preview.includes(`${actorId} → ${targetId}: eligible`), 'self-Shelter preview eligible');
    if (abilityId === 'impale') {
      const hit = preview.events.find(event => event.type === 'damage-applied');
      equal(hit.directionalReduction, Math.min(DEFAULT_ABILITY_RULES.impaleDamage, DEFAULT_ABILITY_RULES.damageRules.directionalReduction), 'protected Impale reduced by runtime rules');
      check(actual.preview.includes(`protection −${hit.directionalReduction}`), 'reduction visible');
    }
    await capture(screenshot); evidence.push({ screenshot, ...actual });
    await click('#confirm'); await settled();
    const result = applyCommand(state, command); check(result.ok, 'real core command accepted');
    matches(await snapshot(), result.state);
    return result.state;
  }
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  await cdp('Page.navigate', { url: `${baseUrl}?play=patrol` });
  await waitFor(`document.querySelector('#patrol')?.dataset.revision==='0'`);
  let state = createPatrol();
  await click('[data-maneuver="expand"]'); await settled();
  state = applyCommand(state, { kind: 'maneuver', maneuver: 'expand', expectedRevision: state.revision }).state;
  state = await select(state, 'shelter', 'ugallu', 'ugallu', 'self-shelter-spread.png');
  check((await snapshot()).shelters.includes('ugallu → ugallu (eligible)'), 'committed self-Shelter eligible');
  const forecast = applyCommand(state, { kind: 'endPhase', expectedRevision: state.revision });
  await click('#end-phase'); await settled(); matches(await snapshot(), forecast.state);
  await click('#export-run');
  const download = join(output, 'poc-001-attempt.json'); let json;
  for (let i = 0; i < 150; i++) { try { json = await readFile(download, 'utf8'); JSON.parse(json); break; } catch { await pause(50); } }
  check(json, 'native revised-kit export completed');
  await rename(download, join(output, 'revised-kit.json'));
  const record = JSON.parse(json), replay = replayRun(json);
  equal(replay.state, record.finalState, 'native revised-kit export replays state');
  equal(replay.events, record.events, 'native revised-kit export replays events');
  await writeFile(join(output, 'old-p07.json'), JSON.stringify({ ...record, rulesVersion: record.rulesVersion.replace(/p14-v1$/, 'p07-v1') }));
  const stylesheet = await evaluate(`document.querySelector('link[rel="stylesheet"]').href`);
  const bundle = await Bun.build({ entrypoints: [new URL('./browser/p14-fixture.ts', import.meta.url).pathname], target: 'browser', minify: true,
    define: { 'import.meta.env.BASE_URL': JSON.stringify('./') }, plugins: [{ name: 'existing-stylesheet', setup(builder) {
      builder.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
    } }] });
  check(bundle.success, 'test-owned fixture compiles');
  document = `<html><head><link rel="stylesheet" href="${stylesheet}"></head><body><div id="app"></div><script type="module">${(await bundle.outputs[0].text()).replaceAll('</script', '<\\/script')}</script></body></html>`;
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/p14-kit-fixture*', resourceType: 'Document' }] });
  for (const mode of ['protected', 'one-partner']) {
    await cdp('Page.navigate', { url: `${baseUrl}p14-kit-fixture?mode=${mode}` });
    await waitFor(`document.querySelector('#patrol')?.dataset.revision==='0'`);
    state = kitFixture(mode);
    state = await select(state, 'impale', 'girtablilu', 'censer', `${mode}-impale.png`);
    const end = applyCommand(state, { kind: 'endPhase', expectedRevision: state.revision });
    await click('#end-phase'); await settled(); matches(await snapshot(), end.state);
  }
  equal(exceptions, [], 'no uncaught browser exceptions');
  await writeFile(join(output, 'summary.json'), JSON.stringify({ ok: true, assertions, evidence }, null, 2));
  console.log(JSON.stringify({ ok: true, assertions, screenshots: 3, output }));
} finally {
  socket?.close(); chrome.kill('SIGTERM');
  if (chrome.exitCode === null) await new Promise(done => chrome.once('exit', done));
  await rm(profile, { recursive: true, force: true });
}
