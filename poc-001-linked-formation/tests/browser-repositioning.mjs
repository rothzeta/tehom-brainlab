// Additive P16 browser contract checks; the existing browser runner remains unchanged.
// Usage: bun tests/browser-repositioning.mjs CHROME OUTPUT [BASE_URL].
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createCrucible } from '../src/content/crucible.ts';
import { createPatrol } from '../src/content/patrol.ts';
import { applyCommand } from '../src/core/transition.ts';
import { previewCommand } from '../src/core/preview.ts';
import { replayRun } from '../src/core/run-record.ts';
import { repositioningFixture } from './browser/repositioning-fixtures.ts';
import { frontCells } from '../src/core/sectors.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME and OUTPUT required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p16-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9240', `--user-data-dir=${profile}`, 'about:blank']);
let socket, assertions = 0, document;
const exceptions = [], evidence = [], pause = ms => new Promise(done => setTimeout(done, ms));
const equal = (a, b, label) => { assertions++; assert.deepEqual(a, b, label); };
const check = (value, label) => { assertions++; assert(value, label); };
const hpText = state => [...state.brood, ...state.enemies].map(e => `${e.id[0].toUpperCase()+e.id.slice(1)} ${e.hp}/${e.maxHp}`).join(' · ');
try {
  let tab;
  for (let i = 0; i < 150; i++) {
    try { tab = await (await fetch('http://localhost:9240/json/new?about:blank', { method: 'PUT' })).json(); break; }
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
    cells:[...document.querySelectorAll('[data-entity]')].map(e=>({id:e.dataset.entity,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),
    shelters:document.querySelector('#shelters').textContent, phase:document.querySelector('#boss-phase')?.textContent, intentions:document.querySelector('#intentions').textContent, events:[...document.querySelectorAll('#events li')].map(e=>e.dataset.event)}))()`);
  function matches(actual, state) {
    equal(actual.revision, state.revision, 'visible revision matches core');
    if (state.enemies.some(e => e.id === 'crucible')) {
      check(state.enemies[0].cell.q === 0 && state.enemies[0].cell.r === 0, 'boss anchored in core');
    }
    equal(actual.hp, [...state.brood, ...state.enemies].map(({ id, hp }) => ({ id, hp })), 'visible HP matches core');
    equal(actual.cells.filter(e=>state.enemies.some(enemy=>enemy.id===e.id)), state.enemies.map(({id,cell})=>({id,cell})), 'visible enemy cells match authoritative state');
  }
  async function capture(name) {
    const { cssContentSize: size } = await cdp('Page.getLayoutMetrics');
    const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } });
    await writeFile(join(output, name), Buffer.from(result.data, 'base64'));
  }
  async function execute(state, input, screenshot) {
    const command = { ...input, expectedRevision: state.revision };
    const preview = previewCommand(state, command, 0); check(preview.ok, 'command accepted by core');
    if (input.kind === 'useAbility') {
      await click(`[data-actor="${input.actorId}"]`); await click(`[data-ability="${input.abilityId}"]`);
      await click(`[data-target="${input.targetId}"]${input.direction ? `[data-direction="${input.direction}"]` : ''}`);
    } else {
      const selector = input.kind === 'endPhase' ? '#end-phase' : `[data-maneuver="${input.maneuver}"]`;
      await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);
    }
    const shown = await snapshot();
    check(shown.preview.includes(`Immediate: ${hpText(preview.state)} · ${preview.state.phase}.`), 'immediate preview matches core');
    if (preview.forecast.kind === 'transition' && preview.forecast.ok) {
      check(shown.preview.includes(`If end phase now: ${hpText(preview.forecast.state)} · ${preview.forecast.state.phase}.`), 'forecast matches core');
      check(!preview.forecast.enemyEvents.some(e => ['boss-phase-changed', 'intentions-announced'].includes(e.type)), 'announcement excluded from enemy forecast');
    }
    if (input.kind === 'endPhase') {
      equal((await snapshot()).cells, [...state.brood.map(e => ({ id: e.id, cell: shown.cells.find(c => c.id === e.id).cell })), ...state.enemies.map(({ id, cell }) => ({ id, cell }))], 'preview leaves live enemy tokens in place');
      const moves = preview.events.filter(e => e.type === 'enemy-moved');
      equal(await evaluate(`[...document.querySelectorAll('#ghosts [data-enemy]')].map(e=>({id:e.dataset.enemy,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}}))`), moves.map(e => ({ id: e.sourceId, cell: e.to })), 'destination ghosts match real relocation');
    }
    if (screenshot) await capture(screenshot);
    await click(input.kind === 'useAbility' ? '#confirm' : input.kind === 'endPhase' ? '#end-phase' : `[data-maneuver="${input.maneuver}"]`);
    await settled();
    const result = applyCommand(state, command); check(result.ok, 'command committed by core');
    matches(await snapshot(), result.state);
    equal((await snapshot()).events, result.events.map(e => e.type), 'visible events match ordered core events');
    return result.state;
  }
  async function navigate(query) {
    await cdp('Page.navigate', { url: `${baseUrl}${query}` });
    await waitFor(`document.querySelector('#patrol')?.dataset.revision==='0'`);
    await settled();
  }
  async function exportAttempt(name, state) {
    const file = join(output, 'poc-001-attempt.json');
    await rm(file, { force: true }); await click('#export-run');
    let json;
    for (let i = 0; i < 150; i++) { try { json = await readFile(file, 'utf8'); JSON.parse(json); break; } catch { await pause(50); } }
    check(json, 'native export downloaded'); await rename(file, join(output, name));
    const record = JSON.parse(json), replay = replayRun(json);
    equal(replay.state, state, 'native export replays committed state'); equal(replay.events, record.events, 'native export replays ordered events');
    evidence.push({ name, buildRevision: record.buildRevision, commands: replay.commands, phase: state.bossPhase, round: state.round });
  }
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1050, deviceScaleFactor: 1, mobile: false });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  // Product records provide unchanged patrol/Crucible replay evidence.
  for (const encounter of ['patrol', 'crucible']) {
    await navigate(`?play=${encounter}`);
    let state = encounter === 'patrol' ? createPatrol() : createCrucible();
    state = await execute(state, { kind: 'endPhase' });
    check(!(await snapshot()).events.some(e => e.startsWith('enemy-mov')), 'stationary product trace has no movement');
    await exportAttempt(`${encounter}.json`, state);
  }
  const stylesheet = await evaluate(`document.querySelector('link[rel="stylesheet"]').href`);
  const dirty = execFileSync('git', ['status', '--porcelain', '--', '.'], { encoding: 'utf8' }).trim();
  const revision = dirty ? 'unknown' : execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const bundle = await Bun.build({ entrypoints: [new URL('./browser/repositioning-fixture.ts', import.meta.url).pathname], target: 'browser', minify: true,
    define: { 'import.meta.env': JSON.stringify({ BASE_URL: './', VITE_POC001_BUILD_REVISION: revision }) },
    plugins: [{ name: 'existing-stylesheet', setup(builder) {
      builder.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
    } }] });
  check(bundle.success, 'test-only fixture compiles');
  document = `<html><head><meta charset="utf-8"><link rel="stylesheet" href="${stylesheet}"></head><body><div id="app"></div><script type="module">${(await bundle.outputs[0].text()).replaceAll('</script', '<\\/script')}</script></body></html>`;
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/repositioning-fixture*', resourceType: 'Document' }] });
  for (const mode of ['mobile', 'corpse']) {
    await navigate(`repositioning-fixture?mode=${mode}`);
    let state = repositioningFixture(mode); matches(await snapshot(), state);
    await capture(`${mode}-before.png`);
    const beforeFront = frontCells(state.enemies[0].cell, state.enemies[0].facing);
    state = await execute(state, { kind: 'endPhase' }, `${mode}-destination-preview.png`);
    check(JSON.stringify(frontCells(state.enemies[0].cell, state.enemies[0].facing)) !== JSON.stringify(beforeFront), 'authoritative front moves with Warder');
    await capture(`${mode}-after.png`);
    if (mode === 'corpse') {
      equal(state.enemies[0].cell, state.enemies[1].cell, 'living Warder shares fallen Censer cell');
      const top = await evaluate(`(()=>{const e=document.querySelector('[data-entity="warder"]');const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('[data-entity]')?.dataset.entity})()`);
      equal(top, 'warder', 'living token owns pointer hit above corpse');
      await click('[data-entity="warder"]');
      check((await evaluate(`document.querySelector('#selection').textContent`)).includes('/ warder'), 'real pointer selects living token');
      state = await execute(state, { kind: 'useAbility', actorId: 'pazuzu', abilityId: 'crosswind', targetId: 'warder', direction: 'clockwise' });
      state = await execute(state, { kind: 'maneuver', maneuver: 'clockwise' });
      state = await execute(state, { kind: 'maneuver', maneuver: 'expand' });
      state = await execute(state, { kind: 'endPhase' });
      await exportAttempt('relocating.json', state);
    }
  }
  equal(exceptions, [], 'no uncaught browser exceptions');
  await writeFile(join(output, 'summary.json'), JSON.stringify({ ok: true, assertions, evidence }, null, 2));
  console.log(JSON.stringify({ ok: true, assertions, output }));
} finally {
  socket?.close(); chrome.kill('SIGTERM');
  if (chrome.exitCode === null) await new Promise(done => chrome.once('exit', done));
  await rm(profile, { recursive: true, force: true });
}
