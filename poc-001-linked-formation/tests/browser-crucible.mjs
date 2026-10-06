// Additive P15 browser contract checks; the existing browser runner remains unchanged.
// Usage: bun tests/browser-crucible.mjs CHROME OUTPUT [BASE_URL].
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createCrucible, phaseTwoPending } from '../src/content/crucible.ts';
import { createPatrol } from '../src/content/patrol.ts';
import { selectRecipients } from '../src/core/intents.ts';
import { applyCommand } from '../src/core/transition.ts';
import { previewCommand } from '../src/core/preview.ts';
import { replayRun } from '../src/core/run-record.ts';
import { crucibleFixture } from './browser/crucible-fixtures.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME and OUTPUT required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p15-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9239', `--user-data-dir=${profile}`, 'about:blank']);
let socket, assertions = 0, document;
const exceptions = [], evidence = [], pause = ms => new Promise(done => setTimeout(done, ms));
const equal = (a, b, label) => { assertions++; assert.deepEqual(a, b, label); };
const check = (value, label) => { assertions++; assert(value, label); };
const hpText = state => [...state.brood, ...state.enemies].map(e => `${e.id[0].toUpperCase()+e.id.slice(1)} ${e.hp}/${e.maxHp}`).join(' · ');
try {
  let tab;
  for (let i = 0; i < 150; i++) {
    try { tab = await (await fetch('http://localhost:9239/json/new?about:blank', { method: 'PUT' })).json(); break; }
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
    shelters:document.querySelector('#shelters').textContent, phase:document.querySelector('#boss-phase')?.textContent, intentions:document.querySelector('#intentions').textContent, events:[...document.querySelectorAll('#events li')].map(e=>e.dataset.event)}))()`);
  function matches(actual, state) {
    equal(actual.revision, state.revision, 'visible revision matches core');
    if (state.enemies.some(e => e.id === 'crucible')) {
      check(state.enemies[0].cell.q === 0 && state.enemies[0].cell.r === 0, 'boss anchored in core');
    }
    equal(actual.hp, [...state.brood, ...state.enemies].map(({ id, hp }) => ({ id, hp })), 'visible HP matches core');
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
  await navigate('?play=crucible');
  let state = createCrucible(); matches(await snapshot(), state);
  equal((await snapshot()).phase, `Phase ${state.bossPhase}`, 'initial active phase visible');
  check((await snapshot()).intentions.includes('not turnable') && (await snapshot()).intentions.includes('follows creature'), 'pulse and mark distinguished');
  check(await evaluate(`document.querySelector('[data-entity="crucible"] img').getAttribute('src').endsWith('foundry-mechanism.svg')`), 'existing boss emblem mapped');
  await capture('crucible-start.png');
  // Play the ordinary product route through both phases, choosing geometry before attacking.
  let crossed = false, sawFork = false;
  for (let rounds = 0; rounds < 20 && state.phase === 'player'; rounds++) {
    const declared = state.declaredIntentions.find(e => e.kind === 'fixed-area');
    const desired = declared && !declared.turnable ? ['compact', 'spread'].sort((a, b) =>
      selectRecipients({ ...state, formation: { ...state.formation, shape: a } }, declared).recipientIds.length
      - selectRecipients({ ...state, formation: { ...state.formation, shape: b } }, declared).recipientIds.length)[0] : state.formation.shape;
    if (state.formation.shape !== desired) state = await execute(state, { kind: 'maneuver', maneuver: desired === 'spread' ? 'expand' : 'contract' });
    const primary = state.declaredIntentions.find(e => e.kind === 'fixed-area');
    if (primary?.turnable && selectRecipients(state, primary).recipientIds.length) {
      state = await execute(state, { kind: 'maneuver', maneuver: 'clockwise' });
    }
    if (primary?.turnable) {
      check((await snapshot()).intentions.includes('fixed cells · turnable'), 'sector turnability visible');
      if (state.bossPhase === 1) await capture('phase-one-sector.png');
      else { sawFork = true; await capture('phase-two-fork.png'); }
    }
    if (state.bossPhase === 2 && primary && !primary.turnable) await capture('phase-two-outer.png');
    for (const [actorId, abilityId] of [['ugallu', 'claw'], ['girtablilu', state.formation.shape === 'spread' ? 'impale' : 'sting'], ['pazuzu', 'gale']]) {
      if (state.phase !== 'player') break;
      const probe = applyCommand(state, { kind: 'useAbility', expectedRevision: state.revision, actorId, abilityId, targetId: 'crucible' });
      if (probe.ok) state = await execute(state, { kind: 'useAbility', actorId, abilityId, targetId: 'crucible' });
      if (phaseTwoPending(state)) {
        equal((await snapshot()).phase, 'Phase two begins at the next announcement', 'pending differs from active phase');
        await capture('phase-pending.png');
      }
    }
    if (state.phase === 'player') {
      const was = state.bossPhase;
      state = await execute(state, { kind: 'endPhase' });
      if (was !== state.bossPhase) { crossed = true; await capture('phase-two-entry.png'); }
    }
  }
  check(crossed && sawFork, 'ordinary play reaches both phases and the fork');
  equal(state.phase, 'victory', 'ordinary attempt can finish');
  await exportAttempt('phase-crossing.json', state);
  await click('#reset'); await settled(); matches(await snapshot(), createCrucible());
  equal((await snapshot()).phase, 'Phase 1', 'reset clears pending and active phase');
  await evaluate(`document.querySelector('#preset').value='phase-two-diagnostic';document.querySelector('#preset').dispatchEvent(new Event('change'))`);
  await settled(); state = createCrucible('phase-two-diagnostic'); matches(await snapshot(), state);
  state = await execute(state, { kind: 'maneuver', maneuver: 'clockwise' });
  state = await execute(state, { kind: 'useAbility', abilityId: 'shelter', actorId: 'ugallu', targetId: 'ugallu' }, 'phase-two-shelter-preview.png');
  state = await execute(state, { kind: 'useAbility', abilityId: 'crosswind', actorId: 'pazuzu', targetId: 'crucible', direction: 'anticlockwise' });
  state = await execute(state, { kind: 'endPhase' });
  equal((await snapshot()).phase, 'Phase 2', 'diagnostic remains active phase two');
  await exportAttempt('phase-two-diagnostic.json', state);
  // Header navigation preserves placeholder mode and route changes create fresh scenes.
  for (const placeholder of [false, true]) {
    await navigate(`?play=crucible${placeholder ? '&placeholder=1' : ''}`);
    const suffix = placeholder ? '&placeholder=1' : '';
    equal(await evaluate(`document.querySelector('header h1').textContent`), 'TEHOM — Crucible', 'boss title');
    equal(await evaluate(`[...document.querySelectorAll('#preset option')].map(e=>e.value)`), ['phase-one', 'phase-two-diagnostic'], 'boss-only presets');
    const link = `header a[href="?play=patrol${suffix}"]`; await click(link);
    await waitFor(`document.querySelector('#patrol')?.dataset.revision==='0' && document.querySelector('header h1').textContent==='TEHOM — Patrol'`);
    matches(await snapshot(), createPatrol());
    check((await snapshot()).intentions.includes('follows creature'), 'patrol intentions retained');
    check(await evaluate(`document.querySelector('#protection').textContent.includes('Warder facing')`), 'patrol guard text retained');
    if (placeholder) {
      check(await evaluate(`[...document.querySelectorAll('#tokens img')].every(e=>e.hidden)`), 'placeholder labels only');
      await capture('placeholder-patrol.png');
    } else { await capture('patrol-start.png'); await exportAttempt('patrol.json', createPatrol()); }
    await click(`header a[href="?play=crucible${suffix}"]`);
    await waitFor(`document.querySelector('#boss-phase')?.textContent==='Phase 1'`);
    await click(`header a[href="?${placeholder ? 'placeholder=1' : ''}"]`);
    await waitFor(`!document.querySelector('#patrol') && !!document.querySelector('#formation-lab')`);
  }
  await cdp('Page.navigate', { url: `${baseUrl}?play=unknown` });
  await waitFor(`!document.querySelector('#patrol') && !!document.querySelector('#formation-lab')`);
  // Controlled threshold and kill snapshots are test-owned intercepted pages.
  await navigate('?play=crucible');
  const stylesheet = await evaluate(`document.querySelector('link[rel="stylesheet"]').href`);
  const bundle = await Bun.build({ entrypoints: [new URL('./browser/crucible-fixture.ts', import.meta.url).pathname], target: 'browser', minify: true,
    define: { 'import.meta.env.BASE_URL': JSON.stringify('./') }, plugins: [{ name: 'existing-stylesheet', setup(builder) {
      builder.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
    } }] });
  check(bundle.success, 'test-owned fixture compiles');
  document = `<html><head><meta charset="utf-8"><link rel="stylesheet" href="${stylesheet}"></head><body><div id="app"></div><script type="module">${(await bundle.outputs[0].text()).replaceAll('</script', '<\\/script')}</script></body></html>`;
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/crucible-fixture*', resourceType: 'Document' }] });
  for (const mode of ['threshold', 'kill']) {
    await navigate(`crucible-fixture?mode=${mode}`); state = crucibleFixture(mode);
    state = await execute(state, { kind: 'useAbility', abilityId: 'gale', actorId: 'pazuzu', targetId: 'crucible' }, `${mode}-preview.png`);
    if (mode === 'threshold') {
      check(phaseTwoPending(state), 'controlled hit crosses threshold');
      equal((await snapshot()).phase, 'Phase two begins at the next announcement', 'controlled pending indicator');
      state = await execute(state, { kind: 'endPhase' });
      equal((await snapshot()).phase, 'Phase 2', 'controlled next announcement enters phase two');
    } else {
      equal(state.phase, 'victory', 'controlled kill wins immediately');
      check(!(await snapshot()).events.includes('boss-phase-changed'), 'kill emits no phase change');
      check(await evaluate(`document.querySelector('#end-phase').disabled`), 'victory disables end phase');
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
