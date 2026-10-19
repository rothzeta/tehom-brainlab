// CDP pattern copied from poc-001-linked-formation/tests/browser-lab.mjs at c82ec3c.
// Run with Bun: bun tests/browser-smoke.mjs CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';

const [chromePath, outputPath, baseUrl = 'http://localhost:4273/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY are required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'q01-chrome-'));
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
    await cdp('Page.navigate', { url: baseUrl + query });
    for (let attempt = 0; attempt < 150; attempt++) {
      if (await evaluate(`document.querySelector('canvas')?.width === 1280 && document.querySelector('[data-screen="${screen}"]') !== null`)) return;
      await pause(100);
    }
    throw new Error(`Canvas/screen ${screen} did not render`);
  }
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await navigate('', 'select');
  equal(await evaluate('document.title'), 'TEHOM — Component Combat', 'page title');
  equal(await evaluate(`(()=>{const c=document.querySelector('canvas');return [c.width,c.height]})()`), [1280, 720], 'logical canvas size');
  equal(await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return r.width>0&&r.height>0})()`), true, 'canvas visibly renders');
  const image = await cdp('Page.captureScreenshot', { format: 'png' });
  await writeFile(join(output, 'select.png'), Buffer.from(image.data, 'base64'));
  await navigate('?screen=battle&encounter=warden&party=anzu,ugallu&start=primed', 'battle');
  equal(await evaluate(`(()=>{const e=document.querySelector('[data-screen="battle"]');return [e.dataset.encounter,e.dataset.party,e.dataset.start]})()`), ['warden', 'ugallu,anzu', 'primed'], 'battle query routed with roster order');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 640, height: 600, deviceScaleFactor: 1, mobile: false });
  await pause(200);
  equal(await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return r.width<=640 && Math.abs(r.width/r.height-16/9)<0.01})()`), true, 'FIT preserves aspect ratio in smaller viewport');
  equal(exceptions, [], 'no browser exceptions');
} finally {
  socket?.close();
  if (chrome.exitCode === null && !launchError) chrome.kill('SIGTERM');
  await closed;
  await rm(profile, { recursive: true, force: true });
}
console.log(JSON.stringify({ ok: true, assertions, output }));
