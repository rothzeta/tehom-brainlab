// CDP connection pattern copied from poc-002-component-combat/tests/browser-smoke.mjs (Q01);
// originally copied from poc-001-linked-formation/tests/browser-lab.mjs at c82ec3c.
// Run with Bun: bun tests/browser-battle.mjs CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';

const [chromePath, outputPath, baseUrl = 'http://localhost:4273/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY are required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'q05-chrome-'));
const chrome = spawn(chromePath, ['--headless', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let diagnostic = ''; chrome.stderr.on('data', data => { diagnostic += data; });
let launchError; chrome.on('error', error => { launchError = error; });
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
  async function navigate(query, screen) {
    await evaluate(`document.documentElement.dataset.previousPage = 'true'`);
    await cdp('Page.navigate', { url: baseUrl + query });
    for (let attempt = 0; attempt < 150; attempt++) {
      try { if (await evaluate(`!document.documentElement?.dataset.previousPage && document.querySelector('canvas')?.width === 1280 && document.querySelector('[data-screen="${screen}"]') !== null && document.querySelector('[data-art-part]') !== null`)) return; } catch (error) { if (!String(error).includes('context')) throw error; }
      await pause(100);
    }
    throw new Error(`Canvas/screen ${screen} did not render: ${JSON.stringify(exceptions)} ${await evaluate('document.body.innerText')}`);
  }
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  async function click(selector) {
    const point = await evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});if(!n||n.disabled)throw Error('Missing/enabled control: '+${JSON.stringify(selector)});n.scrollIntoView({block:'nearest'});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
  }
  async function key(key, code = key) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, ...(key === 'Enter' ? {text:'\r',unmodifiedText:'\r'} : {}), windowsVirtualKeyCode: key === 'Enter' ? 13 : key === 'Tab' ? 9 : key === 'Escape' ? 27 : 0 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
  }
  async function keyboardControl(id) {
    // Travel using the screen's arrow navigation, never focus() or click().
    for (let step = 0; step < 250; step++) {
      if (await evaluate(`document.activeElement?.dataset.control === ${JSON.stringify(id)}`)) { await key('Enter'); return; }
      await key('ArrowRight');
      // Begin the keyboard route through a native Tab if focus is outside it.
      if (step === 0 && !await evaluate(`Boolean(document.activeElement?.closest('[data-screen="battle"]'))`)) await key('Tab');
    }
    await image('keyboard-failure.png'); throw Error('Keyboard control unreachable: ' + id + ' ' + await evaluate(`JSON.stringify({focus:document.activeElement?.dataset.control,controls:Array.from(document.querySelectorAll('button'),n=>n.dataset.control),body:document.body.innerText})`));
  }
  async function confirmWithParity(useKeyboard = false) {
    const expected = await evaluate(`JSON.parse(document.querySelector('[data-preview-events]').dataset.previewEvents)`);
    equal(await evaluate(`document.querySelector('[data-control="confirm"]').disabled`), false, 'legal preview enables Confirm');
    if (useKeyboard) await keyboardControl('confirm'); else await click('[data-control="confirm"]');
    equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents)`), expected, 'confirmed events exactly equal previewed ordered events');
  }
  async function image(name) {
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(output, name), Buffer.from(shot.data, 'base64'));
  }
  for (const encounter of ['warden', 'scribe']) {
    await navigate(`?screen=battle&encounter=${encounter}&party=ugallu,girtablilu,anzu&start=fresh`, 'battle');
    for (let attempt = 0; attempt < 150; attempt++) {
      if (await evaluate(`document.querySelectorAll('[data-art-part]').length > 0`)) break;
      await pause(100);
    }
    const parts = await evaluate(`Array.from(document.querySelectorAll('[data-list-part]'),n=>n.dataset.listPart)`);
    equal(parts.length > 0, true, 'enemy parts rendered');
    for (const part of parts) {
      const list = `[data-list-part="${part}"]`, art = `[data-art-part="${part}"]`;
      await click(list);
      equal(await evaluate(`document.querySelector(${JSON.stringify(art)}).getAttribute('aria-pressed')`), 'true', `${part}: list selects illustration`);
      // Select another part so the reverse check cannot pass from old state.
      const other = parts.find(p => p !== part);
      await click(`[data-list-part="${other}"]`);
      await click(art);
      equal(await evaluate(`document.querySelector(${JSON.stringify(list)}).getAttribute('aria-pressed')`), 'true', `${part}: illustration selects list`);
      equal(await evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(art)});return n.offsetWidth>=48&&n.offsetHeight>=48})()`), true, `${part}: generous logical target`);
    }
    if (encounter === 'warden') { await image('warden-selection.png'); await image('intent-panel.png'); }
  }
  // A pointer may hover an unrelated actor; Enter must still execute focus.
  await navigate('?screen=battle&encounter=warden&party=ugallu,girtablilu,anzu&start=primed', 'battle');
  await keyboardControl('actor-anzu');
  await keyboardControl('menu-Skills');
  await keyboardControl('action-stolen-bolt');
  equal(await evaluate(`JSON.parse(document.querySelector('[data-command]').dataset.command).actor`), 'anzu', 'keyboard actor/action selected');
  const command = await evaluate(`JSON.parse(document.querySelector('[data-command]').dataset.command)`);
  const anotherTarget = await evaluate(`Array.from(document.querySelectorAll('[data-target]:not(:disabled)')).find(n=>n.getAttribute('aria-pressed')!=='true')?.dataset.control`);
  if (anotherTarget) await keyboardControl(anotherTarget);
  const selected = await evaluate(`JSON.parse(document.querySelector('[data-command]').dataset.command)`);
  equal(selected.actor, command.actor, 'keyboard target retains actor');
  await image('preview.png');
  const before = await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`);
  await key('Escape');
  equal(await evaluate(`document.querySelector('[data-command]').dataset.command`), 'null', 'Escape backs out without commit');
  equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`), before, 'Back preserves state revision');
  await keyboardControl('menu-Guard');
  // Rapture may forbid Guard after a crossing; this is before any command.
  await keyboardControl('confirm');
  equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents).find(e=>e.kind==='action-used')?.actor`), 'anzu', 'keyboard Guard executes selected actor');
  await keyboardControl('actor-ugallu');
  await keyboardControl('menu-Attack');
  // Put the pointer over a different actor after focusing Confirm.
  for (let attempt=0; attempt<250; attempt++) {
    if (await evaluate(`document.activeElement?.dataset.control==='confirm'`)) break;
    await key('ArrowRight');
  }
  const hovered = await evaluate(`(()=>{const r=document.querySelector('[data-actor="girtablilu"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...hovered });
  const expected = await evaluate(`JSON.parse(document.querySelector('[data-preview-events]').dataset.previewEvents)`);
  await key('Enter');
  equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents)`), expected, 'focused Confirm ignores hovered actor');
  await keyboardControl('end-phase'); await confirmWithParity(true);
  equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.phase`), 'player', 'keyboard End Phase advances battle');
  // Revoke: cancelled/revoked intents stay inspectable with their reason.
  await navigate('?screen=battle&encounter=scribe&party=anzu&start=fresh', 'battle');
  await click('[data-control="menu-Skills"]'); await click('[data-action="revoke"]');
  await confirmWithParity();
  equal(await evaluate(`Array.from(document.querySelectorAll('[data-intent]')).some(n=>n.classList.contains('revoked')&&n.textContent.includes('revoked'))`), true, 'revoked intent remains struck through with reason');
  await click('[data-control="mute"]');
  equal(await evaluate(`document.querySelector('[data-control="mute"]').textContent`), 'Mute', 'visible gesture unmutes');
  await click('[data-control="credits"]');
  equal(await evaluate(`document.querySelector('dialog[open]')?.textContent.includes('CC BY 3.0')`), true, 'emblem credits reachable');
  await key('Escape');
  await navigate('?screen=battle&encounter=guard&party=ugallu,girtablilu,anzu&start=wounded', 'battle');
  await keyboardControl('actor-girtablilu');
  await keyboardControl('menu-Item');
  await confirmWithParity(true);
  equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents).some(e=>e.kind==='item-used'&&e.actor==='girtablilu')`), true, 'Item reachable and committed using keyboard');
  // Invalid targets remain visible with a disabled action and explanatory text.
  await navigate('?screen=battle&encounter=beast&party=ugallu&start=fresh', 'battle');
  await click('[data-control="menu-Attack"]');
  equal(await evaluate(`Array.from(document.querySelectorAll('[data-target]')).some(n=>n.disabled&&n.textContent.includes('shielded'))`), true, 'shielded core disabled with reason');
  const invalidRevision = await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`);
  await click('[data-list-part="corrected-beast#1/core"]');
  equal(await evaluate(`document.querySelector('[data-control="confirm"]').disabled`), true, 'inspecting an invalid part cannot confirm the previous valid target');
  equal(await evaluate(`document.querySelector('[data-preview-events]').textContent.includes('illegal-target')`), true, 'invalid selection displays the rejection code');
  equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`), invalidRevision, 'invalid selection preserves live revision');
  // Every shipped encounter reaches an outcome via visible UI commands.
  const outcomes = [];
  for (const encounter of ['guard','scribe','beast','guard-scribe','beast-scribe','guard-beast','warden']) {
    await navigate(`?screen=battle&encounter=${encounter}&party=ugallu,girtablilu,anzu&start=fresh`, 'battle');
    let steps = 0;
    while (await evaluate(`document.querySelector('[data-screen="battle"]').dataset.phase === 'player'`)) {
      assert(steps++ < 150, `${encounter}: fight must terminate`);
      const actor = await evaluate(`Array.from(document.querySelectorAll('[data-actor]')).find(n=>Number(n.dataset.hp)>0&&n.dataset.acted==='false')?.dataset.actor`);
      if (actor) {
        await click(`[data-actor="${actor}"]`);
        await click('[data-control="menu-Attack"]');
      } else await click('[data-control="end-phase"]');
      await confirmWithParity();
    }
    const outcome = await evaluate(`document.querySelector('[data-screen="battle"]').dataset.phase`);
    equal(['victory','defeat'].includes(outcome), true, `${encounter}: full fight reaches terminal outcome`);
    outcomes.push({encounter,outcome,commands:steps});
  }
  console.log(JSON.stringify({outcomes}));
  equal(exceptions, [], 'no browser exceptions');
} finally {
  socket?.close();
  if (chrome.exitCode === null && !launchError) chrome.kill('SIGTERM');
  await closed;
  await rm(profile, { recursive: true, force: true });
}
console.log(JSON.stringify({ ok: true, assertions, output }));
