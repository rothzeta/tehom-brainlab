// Native browser inputs and local downloads; automation is not human tester evidence.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { applyCommand } from '../src/core/transition.ts';
import { parseRunRecord, replayRun } from '../src/core/run-record.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p11-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9237', `--user-data-dir=${profile}`, 'about:blank']);
let socket, diagnostic = '', assertions = 0;
const exceptions = [], runs = [];
chrome.stderr.on('data', data => { diagnostic += data; });
const pause = ms => new Promise(done => setTimeout(done, ms));
const check = (value, label) => { assertions++; assert(value, label); };
const equal = (value, expected, label) => { assertions++; assert.deepEqual(value, expected, label); };
try {
  let tab;
  for (let i = 0; i < 150; i++) {
    try { tab = await (await fetch('http://localhost:9237/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${diagnostic}`); await pause(100); }
  }
  check(tab, 'Chrome started'); socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const number = ++id; pending.set(number, { resolve, reject }); socket.send(JSON.stringify({ id: number, method, params }));
  });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { const callbacks = pending.get(message.id); pending.delete(message.id); message.error ? callbacks.reject(message.error) : callbacks.resolve(message.result); }
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
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
    const position = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...position });
  }
  async function key(key, text) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, ...(text ? { text } : {}) });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key });
  }
  async function preset(name) {
    await click('#preset'); await key('Home');
    for (let i = 0; i < ['healthy', 'wounded-ugallu', 'wounded-girtablilu'].indexOf(name); i++) await key('ArrowDown');
    await key('Enter', '\r'); await waitFor(`document.querySelector('#preset').value===${JSON.stringify(name)}`);
    await click('#reset');
  }
  async function exported(name) {
    await click('#export-run'); const path = join(output, 'poc-001-attempt.json');
    let json;
    for (let i = 0; i < 150; i++) {
      try { json = await readFile(path, 'utf8'); JSON.parse(json); break; } catch { await pause(50); }
    }
    check(json, 'native export completed'); await rename(path, join(output, name));
    const record = parseRunRecord(json), replay = replayRun(json);
    equal(replay.state, record.finalState, 'downloaded final state reproduces');
    equal(replay.events, record.events, 'downloaded event order reproduces');
    equal(await evaluate('Number(document.querySelector("#patrol").dataset.revision)'), replay.state.revision, 'download matches visible revision');
    equal(await evaluate('[...document.querySelectorAll("[data-entity]")].map(e=>({id:e.dataset.entity,hp:Number(e.dataset.hp),maxHp:Number(e.dataset.maxHp)}))'),
      [...record.finalState.brood, ...record.finalState.enemies].map(({ id, hp, maxHp }) => ({ id, hp, maxHp })), 'download matches visible HP');
    return record;
  }
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  await cdp('Page.navigate', { url: `${baseUrl}?play=patrol&placeholder=1` });
  await waitFor('document.querySelector("#patrol")?.dataset.revision==="0"');
  const historical = JSON.parse(await readFile(new URL('../../docs/mailbox/p08-patrol-round-loop/traces.json', import.meta.url), 'utf8'));
  for (const start of ['healthy', 'wounded-ugallu', 'wounded-girtablilu']) {
    for (const strategy of ['attack', 'forfeit']) {
      await preset(start);
      const initial = await exported(`${start}-${strategy}-initial.json`);
      equal(initial.acceptedCommands, [], 'restart removes all prior accepted inputs');
      equal(initial.events, [], 'restart removes all prior events');
      equal(initial.fixtureId, start, 'preset identified');
      equal(initial.initialState, initial.finalState, 'restart starts a new record');
      let state = initial.initialState; const accepted = [], events = []; let rejected = 0;
      const trace = historical.traces.find(t => t.preset === (strategy === 'forfeit' ? 'healthy' : start) && t.strategy === strategy);
      check(trace, 'P08 command trace found');
      for (const step of trace.steps) {
        const command = { ...step.command, expectedRevision: state.revision };
        const result = applyCommand(state, command);
        let selector = command.kind === 'endPhase' ? '#end-phase' : `[data-maneuver="${command.maneuver}"]`;
        if (command.kind === 'useAbility') {
          selector = `[data-actor="${command.actorId}"]`;
          if (!await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`)) {
            await click(selector); selector = `[data-ability="${command.abilityId}"]`;
            if (!await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`)) {
              await click(selector); selector = `[data-target="${command.targetId}"]${command.direction ? `[data-direction="${command.direction}"]` : ''}`;
            }
          }
        }
        if (result.ok) {
          check(!await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`), 'accepted input enabled');
          await click(selector); if (command.kind === 'useAbility') await click('#confirm');
          await waitFor('document.querySelector("#patrol").dataset.busy==="false"');
          state = result.state; accepted.push(command); events.push(...result.events);
        } else {
          check(await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`), 'rejected input visibly unavailable');
          await click(selector); rejected++;
        }
      }
      const record = await exported(`${start}-${strategy}.json`);
      equal(record.acceptedCommands.map(e => e.command), accepted, 'only actual accepted inputs captured in order');
      equal(record.finalState, state, 'export equals current-rule transitions');
      equal(record.events, events, 'export equals actual core events');
      runs.push({ preset: start, strategy, accepted: accepted.length, rejected, phase: state.phase, round: state.round,
        buildRevision: record.buildRevision, file: `${start}-${strategy}.json` });
    }
  }
  // Selections/previews and native attempts on disabled controls never become accepted inputs.
  await preset('healthy');
  await click('[data-actor="ugallu"]'); await click('[data-ability="claw"]'); await click('[data-target="warder"]');
  const selected = await exported('selection-only.json');
  equal(selected.acceptedCommands, [], 'selected ability is not an accepted command');
  equal(selected.events, [], 'selection emits no gameplay events');
  await click('#cancel');
  const maneuver = { kind: 'maneuver', maneuver: 'clockwise', expectedRevision: 0 };
  const moved = applyCommand(selected.initialState, maneuver); check(moved.ok, 'controlled maneuver accepted');
  await click('[data-maneuver="clockwise"]');
  check(await evaluate(`document.querySelector('[data-maneuver="anticlockwise"]').disabled`), 'feedback lock blocks duplicate');
  await click('[data-maneuver="anticlockwise"]');
  await waitFor('document.querySelector("#patrol").dataset.busy==="false"');
  equal(await evaluate(`document.querySelector('[data-maneuver="clockwise"]').dataset.reason`), 'maneuver-used', 'second maneuver explicitly unavailable');
  await click('[data-maneuver="clockwise"]');
  const rejected = await exported('rejected-input.json');
  equal(rejected.acceptedCommands.map(e => e.command), [maneuver], 'busy and rejected activations are absent');
  equal(rejected.finalState, moved.state, 'rejected activations preserve state');
  equal(rejected.events, moved.events, 'rejected activations preserve event stream');
  await click('#reset');
  const reset = await exported('reset-after-rejection.json');
  equal(reset.acceptedCommands, [], 'reset after accepted/rejected inputs starts clean');
  equal(reset.events, [], 'reset after inputs clears event stream');
  equal(reset.initialState, reset.finalState, 'reset records the new initial state');
  equal(exceptions, [], 'no uncaught browser exceptions');
  await writeFile(join(output, 'summary.json'), JSON.stringify({ ok: true, assertions, automated: true, runs }, null, 2));
  console.log(JSON.stringify({ ok: true, assertions, automated: true, runs, output }));
} finally {
  socket?.close(); chrome.kill('SIGTERM'); if (chrome.exitCode === null) await new Promise(done => chrome.once('exit', done));
  await rm(profile, { recursive: true, force: true });
}
