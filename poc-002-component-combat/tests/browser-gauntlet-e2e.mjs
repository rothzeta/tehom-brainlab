// CDP pattern copied from browser-battle.mjs (Q05) and browser-run.mjs (Q08).
// Every game interaction uses keyboard input; evaluation only reads rendered state.
// Run: bun tests/browser-gauntlet-e2e.mjs CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { applyCommand, parseRecord, replayRecord } from '../src/core/index.ts';

const trace = parseRecord(await readFile(new URL('../fixtures/parity/gauntlet-win-trio-v1.json', import.meta.url), 'utf8'));
const [chromePath, outputPath, baseUrl = 'http://localhost:4273/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY are required');
const output = resolve(outputPath), downloads = join(output, 'downloads');
await mkdir(downloads, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'q09-chrome-'));
const chrome = spawn(chromePath, ['--headless', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let diagnostic = '', launchError;
chrome.stderr.on('data', data => { diagnostic += data; });
chrome.on('error', error => { launchError = error; });
const closed = new Promise(done => chrome.once('close', done));
const pause = ms => new Promise(done => setTimeout(done, ms));
let socket, assertions = 0;
const exceptions = [];
function equal(actual, expected, message) { assertions++; assert.deepEqual(actual, expected, message); }
try {
  let tab;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (launchError) throw launchError;
    if (chrome.exitCode !== null) throw new Error(`Chrome exited ${chrome.exitCode}: ${diagnostic}`);
    try {
      const port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
      tab = await (await fetch(`http://localhost:${port}/json/new?about:blank`, { method: 'PUT' })).json();
      break;
    } catch { await pause(100); }
  }
  assert(tab, `Chrome did not start: ${diagnostic}`);
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id); pending.delete(message.id);
      clearTimeout(request.timeout);
      message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  };
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const number = ++id;
      const timeout = setTimeout(() => { pending.delete(number); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(number, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id: number, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function key(key, code = key) {
    const text = key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined;
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, ...(text ? { text, unmodifiedText: text } : {}), windowsVirtualKeyCode: key === 'Enter' ? 13 : key === 'Tab' ? 9 : key === ' ' ? 32 : 0 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
  }
  async function tabTo(selector) {
    for (let attempt = 0; attempt < 200; attempt++) {
      if (await evaluate(`document.activeElement?.matches(${JSON.stringify(selector)})`)) return;
      await key('Tab');
    }
    throw new Error(`Keyboard Tab cannot reach ${selector}`);
  }
  async function activate(control) {
    // Battle arrows stay within the battle; native Tab also reaches the toolbar.
    // Choose either direction from the public DOM order, without focus()/click().
    for (let attempt = 0; attempt < 250; attempt++) {
      const route = await evaluate(`(() => {
        const id = ${JSON.stringify(control)};
        const target = Array.from(document.querySelectorAll('button')).find(n => n.dataset.control === id);
        if (!target || target.disabled || !target.getClientRects().length) throw Error('Unavailable control: ' + id);
        if (document.activeElement === target) return 'ready';
        const surface = document.activeElement?.closest('.battle-surface');
        if (!surface?.contains(target)) return 'Tab';
        const buttons = Array.from(surface.querySelectorAll('button:not(:disabled)'));
        const from = buttons.indexOf(document.activeElement), to = buttons.indexOf(target);
        const right = (to - from + buttons.length) % buttons.length;
        const left = (from - to + buttons.length) % buttons.length;
        return right <= left ? 'ArrowRight' : 'ArrowLeft';
      })()`);
      if (route === 'ready') { await key('Enter'); return; }
      await key(route);
    }
    throw new Error(`Keyboard cannot reach control: ${control}`);
  }
  await cdp('Page.enable'); await cdp('Runtime.enable');
  // The sole page-side write installs the authorized observation callback before
  // application scripts run. It never supplies commands, state or expected cues.
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `
    globalThis.__Q09_CUE_REQUESTS__ = [];
    globalThis.__POC002_AUDIO_TEST_OBSERVER__ = cues => globalThis.__Q09_CUE_REQUESTS__.push([...cues]);
  ` });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: baseUrl });
  let ready = false;
  for (let attempt = 0; attempt < 150; attempt++) {
    try {
      if (await evaluate(`document.querySelector('[data-screen="select"]') !== null && document.querySelector('canvas')?.width === 1280`)) { ready = true; break; }
    } catch (error) { if (!String(error).includes('context')) throw error; }
    await pause(100);
  }
  equal(ready, true, 'selection renders');
  equal(await evaluate('globalThis.__Q09_CUE_REQUESTS__'), [], 'no cue requests on selection');
  for (const brood of trace.run.party) {
    const selector = `input[name="party"][value="${brood}"]`;
    if (!await evaluate(`document.querySelector(${JSON.stringify(selector)}).checked`)) {
      await tabTo(selector); await key(' ', 'Space');
    }
  }
  await activate('start-gauntlet');
  equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.party`), trace.run.party.join(','), 'keyboard launches the trio gauntlet');
  let state = trace.initialState, boundaries = 0;
  for (const step of trace.commands) {
    const command = step.command;
    const cueCount = await evaluate('globalThis.__Q09_CUE_REQUESTS__.length');
    if (command.kind === 'continue') {
      equal(await evaluate(`document.querySelector('[data-screen="run"]').dataset.phase`), 'between-fights', 'Continue requires an explicit boundary');
      await activate('continue-run'); boundaries++;
    } else {
      if (command.kind === 'endPhase') await activate('end-phase');
      else {
        await activate(`actor-${command.actor}`);
        const basic = trace.content.brood.find(b => b.id === command.actor).actions[0];
        if (command.action === basic) await activate('menu-Attack');
        else if (command.action === 'guard') await activate('menu-Guard');
        else if (command.action === 'salve') await activate('menu-Item');
        else { await activate('menu-Skills'); await activate(`action-${command.action}`); }
        const target = await evaluate(`Array.from(document.querySelectorAll('[data-target]:not(:disabled)')).find(n => n.dataset.target === ${JSON.stringify(JSON.stringify(command.target))})?.dataset.control`);
        equal(typeof target, 'string', 'command target is keyboard reachable');
        await activate(target);
      }
      equal(await evaluate(`JSON.parse(document.querySelector('[data-command]').dataset.command)`), command, 'keyboard selection previews exactly the requested command');
      equal(await evaluate('globalThis.__Q09_CUE_REQUESTS__.length'), cueCount, 'preview and keyboard navigation request no audio');
      await activate('confirm');
      equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents)`), step.events, 'confirmed UI events match the versioned witness');
    }
    const result = applyCommand(trace.content, state, command);
    equal(result.ok, true, 'witness command is accepted by the public API');
    state = result.state;
    equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`), String(state.revision), 'UI revision matches the transition');
    equal(await evaluate(`document.querySelector('[data-screen="run"]').dataset.phase`), state.phase, 'run phase matches the transition');
  }
  equal(boundaries, trace.run.encounters.length - 1, 'keyboard traverses every gauntlet boundary');
  equal(state.phase, 'victory', 'keyboard-only trio run reaches victory');
  equal(await evaluate(`document.querySelector('[data-control="mute"]').textContent`), 'Unmute', 'observing requests preserves the initial mute choice');
  const requested = await evaluate('globalThis.__Q09_CUE_REQUESTS__');
  const cueKinds = [...new Set(requested.flat())].sort();
  equal(cueKinds, ['hit', 'armor', 'component-destroyed', 'poison', 'revelation', 'death'].sort(), 'actual createAudio requests cover all six cue kinds');
  await writeFile(join(output, 'audio-requests.json'), JSON.stringify(requested, null, 2) + '\n');
  await activate('export-record');
  const downloaded = join(downloads, `poc-002-gauntlet-r${state.revision}.json`);
  let record, raw, downloadError;
  for (let attempt = 0; attempt < 150; attempt++) {
    try { raw = await readFile(downloaded, 'utf8'); record = parseRecord(raw); break; }
    catch (error) { downloadError = error; await pause(100); }
  }
  equal(Boolean(record), true, `keyboard export downloads valid JSON: ${downloadError ?? ''}`);
  equal(record.commands, trace.commands, 'actual download contains the complete accepted UI history');
  equal(record.finalState, state, 'actual download contains the final UI state');
  const replay = replayRecord(record);
  equal(replay.ok, true, 'download replays through the public core');
  equal(replay.state, state, 'public replay reaches the exported victory');
  await writeFile(join(output, 'keyboard-gauntlet.json'), raw);
  const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
  const cli = spawn('./poc-002-component-combat/bin/run', ['replay', downloaded], { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  cli.stdout.on('data', data => { stdout += data; }); cli.stderr.on('data', data => { stderr += data; });
  const code = await new Promise((done, fail) => { cli.on('error', fail); cli.on('close', done); });
  equal(code, 0, `actual download replays through bin/run replay: ${stderr}`);
  equal(stdout.trim(), `commands=${replay.commands} events=${replay.events} outcome=victory`, 'Docker replay prints the downloaded command/event counts and victory');
  equal(stderr, '', 'successful replay has no stderr');
  const shot = await cdp('Page.captureScreenshot', { format: 'png' });
  await writeFile(join(output, 'keyboard-gauntlet-victory.png'), Buffer.from(shot.data, 'base64'));
  equal(exceptions, [], 'no browser exceptions');
  console.log(JSON.stringify({ keyboardOnly: true, commands: record.commands.length, boundaries, cueKinds, cueRequests: requested.length, replay: stdout.trim(), downloaded }));
} finally {
  socket?.close();
  if (chrome.exitCode === null && !launchError) chrome.kill('SIGTERM');
  await closed;
  await rm(profile, { recursive: true, force: true });
}
console.log(JSON.stringify({ ok: true, assertions, output }));
