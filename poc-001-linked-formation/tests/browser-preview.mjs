// Additive P09 browser probe. Run with Bun: browser-preview.mjs CHROME OUTPUT [BASE_URL].
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createPatrol } from '../src/content/patrol.ts';
import { applyCommand } from '../src/core/transition.ts';
import { formationPositions } from '../src/core/formation.ts';
import { activeLinks, selectRecipients } from '../src/core/intents.ts';
import { ABILITIES } from '../src/content/brood.ts';
import { abilityLegality } from '../src/core/abilities.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME and OUTPUT required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p09-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--remote-debugging-port=9235', `--user-data-dir=${profile}`, 'about:blank']);
let diagnostic = ''; chrome.stderr.on('data', (data) => { diagnostic += data; });
let socket, assertions = 0;
const exceptions = [], pause = (ms) => new Promise((done) => setTimeout(done, ms));
const check = (value, message) => { assertions++; assert(value, message); };
const equal = (actual, expected, message) => { assertions++; assert.deepEqual(actual, expected, message); };
try {
  let tab;
  for (let attempt = 0; attempt < 150; attempt++) {
    try { tab = await (await fetch('http://localhost:9235/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${diagnostic}`); await pause(100); }
  }
  check(tab, 'Chrome started');
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id) { const callbacks = pending.get(message.id); pending.delete(message.id);
      message.error ? callbacks.reject(message.error) : callbacks.resolve(message.result); }
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  };
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const number = ++id; pending.set(number, { resolve, reject });
    socket.send(JSON.stringify({ id: number, method, params }));
  });
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function waitFor(expression) {
    for (let attempt = 0; attempt < 150; attempt++) { if (await evaluate(expression)) return; await pause(100); }
    throw new Error(`Timeout: ${expression}`);
  }
  async function point(selector) {
    return evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  }
  async function click(selector) {
    const position = await point(selector);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...position });
  }
  const snapshot = () => evaluate(`(()=>({revision:Number(document.querySelector('#formation-lab').dataset.revision),
    panel:document.querySelector('#combat-preview').textContent,
    facts:[...document.querySelectorAll('#combat-preview p')].map(e=>e.textContent),
    readout:document.querySelector('#preview-readout').textContent,
    positions:[...document.querySelectorAll('.brood-token')].map(e=>({brood:e.dataset.brood,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),
    ghosts:[...document.querySelectorAll('.ghost')].map(e=>({brood:e.dataset.brood,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}}))}))()`);
  async function capture(name) {
    const { cssContentSize: size } = await cdp('Page.getLayoutMetrics');
    const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } });
    await writeFile(join(output, name), Buffer.from(result.data, 'base64'));
  }
  await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
  await cdp('Page.bringToFront'); await cdp('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const version = await cdp('Browser.getVersion');
  await cdp('Page.navigate', { url: baseUrl + '?preview=patrol' });
  await waitFor(`document.querySelectorAll('.brood-token').length===3 && document.querySelector('#combat-preview')?.hidden===false`);
  await waitFor(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art==='loaded')`);
  const initial = await snapshot();
  const state = createPatrol();
  const command = { kind: 'maneuver', expectedRevision: state.revision, maneuver: 'expand' };
  const committed = applyCommand(structuredClone(state), command); check(committed.ok, 'independent real maneuver succeeds');
  const ended = applyCommand(structuredClone(committed.state), { kind: 'endPhase', expectedRevision: committed.state.revision });
  check(ended.ok, 'independent real end phase succeeds');
  const hp = (value) => value.brood.map((entity) => `${entity.brood[0].toUpperCase()+entity.brood.slice(1)} ${entity.hp}/${entity.maxHp}`).join(' · ');
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...await point('[data-maneuver="expand"]') });
  const preview = await snapshot();
  equal(preview.revision, initial.revision, 'preview leaves revision'); equal(preview.positions, initial.positions, 'preview leaves live positions');
  equal(preview.ghosts, formationPositions(committed.state.formation), 'preview destinations equal independent commit');
  check(preview.panel.includes(`Live: ${hp(state)}.`), 'live HP unchanged');
  check(preview.panel.includes(`Immediate: ${hp(committed.state)} · ${committed.state.phase}.`), 'immediate HP/phase equal real commit');
  check(preview.panel.includes(`If end phase now: ${hp(ended.state)} · ${ended.state.phase}.`), 'labelled forecast HP/phase equal real end phase');
  check(preview.panel.includes('Remaining player choices are excluded.'), 'forecast discloses exact condition');
  const links = activeLinks(committed.state, committed.state.patrolRules.closeThreshold);
  equal(preview.facts.find(line => line.startsWith('Destination links:')),
    `Destination links: ${links.map(link => `${link.from.brood} ↔ ${link.to.brood} ${link.state}`).join('; ')}.`,
    'destination links match public selector and stored threshold');
  check(preview.panel.includes('Protection gained:') && preview.panel.includes('lost:'), 'protection changes shown');
  const threats = committed.state.declaredIntentions.map(intention => ({ intention,
    ...selectRecipients(committed.state, intention, committed.state.patrolRules.splashRadius) }));
  equal(preview.facts.find(line => line.startsWith('Threats:')),
    `Threats: ${threats.map(entry => `${entry.intention.kind === 'fixed-area' ? 'Area' : 'Mark'} ${entry.intention.id} at ${entry.cells.map(cell => `(${cell.q},${cell.r})`).join(', ')} → ${entry.recipientIds.join(', ') || entry.reason}`).join('; ')}.`,
    'all declared anchors and exact recipients match public selector and stored radius');
  const changes = enabled => {
    const names = state.brood.flatMap(actor => Object.entries(ABILITIES)
      .filter(([, definition]) => definition.brood === actor.brood)
      .flatMap(([abilityId]) => (abilityId === 'shelter' ? state.brood : state.enemies)
        .flatMap(target => (abilityId === 'crosswind' ? ['clockwise', 'anticlockwise'] : [undefined])
          .flatMap(direction => {
            const request = { actorId: actor.id, abilityId, targetId: target.id,
              ...(direction ? { direction } : {}) };
            const before = abilityLegality(state, { ...request, expectedRevision: state.revision });
            const after = abilityLegality(committed.state, { ...request, expectedRevision: committed.state.revision });
            return before.ok !== after.ok && after.ok === enabled
              ? [abilityId[0].toUpperCase()+abilityId.slice(1)] : [];
          }))));
    return [...new Set(names)].join(', ') || 'none';
  };
  equal(preview.facts.find(line => line.startsWith('Abilities enabled:')),
    `Abilities enabled: ${changes(true)}; disabled: ${changes(false)}.`, 'ability changes match public legality');
  await capture('preview.png');
  await click('[data-maneuver="expand"]'); const actual = await snapshot();
  equal(actual.positions, preview.ghosts, 'actual native commit matches preview destinations');
  equal(actual.revision, committed.state.revision, 'actual native commit uses one revision');
  equal(actual.ghosts, [], 'accepted command invalidates pending preview');
  check(!actual.panel.includes('If end phase now:'), 'stale forecast cleared');
  check(actual.panel.includes(`Live: ${hp(committed.state)}.`), 'forecast did not spend live HP');
  await capture('commit.png');
  await click('#reset');
  equal((await snapshot()).revision, 0, 'reset creates fresh generation');
  await evaluate(`document.querySelector('[data-maneuver="clockwise"]').focus()`);
  check((await snapshot()).panel.includes('If end phase now:'), 'keyboard focus shows forecast');
  await click('#cancel');
  check(!(await snapshot()).panel.includes('If end phase now:'), 'cancel clears conditional forecast');
  equal((await snapshot()).revision, 0, 'cancel spends no revision');
  equal(exceptions, [], 'no uncaught browser exceptions');
  await writeFile(join(output, 'browser.json'), JSON.stringify({ ok: true, assertions, version,
    viewport: { width: 1280, height: 800 }, initial, preview, committed: actual, exceptions }, null, 2)+'\n');
  console.log(JSON.stringify({ ok: true, assertions, screenshots: 2, exceptions: exceptions.length, output }));
} finally {
  socket?.close(); chrome.kill('SIGTERM');
  await new Promise((done) => { if (chrome.exitCode !== null) done(); else chrome.once('exit', done); });
  await writeFile(join(output, 'chrome-stderr.txt'), diagnostic); await rm(profile, { recursive: true, force: true });
}
