// Run with Bun: bun tests/browser-lab.mjs CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]
// A real-browser contract probe over CDP; artifacts/profile remain outside the repository.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { formations, formationPositions, formationLinks } from '../src/core/formation.ts';
import { applyCommand } from '../src/core/transition.ts';
import { createInitialState } from '../src/core/state.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY are required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p04-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=9234', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let diagnostic = ''; chrome.stderr.on('data', (data) => { diagnostic += data; });
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
let socket;
const requests = [], failures = [], exceptions = [], trace = [];
let assertions = 0;
function check(value, message) { assertions++; assert(value, message); }
function equal(actual, expected, message) { assertions++; assert.deepEqual(actual, expected, message); }
try {
  let tab;
  for (let attempt = 0; attempt < 150; attempt++) {
    try { tab = await (await fetch('http://localhost:9234/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { if (chrome.exitCode !== null) throw new Error(`Chrome exited ${chrome.exitCode}: ${diagnostic}`); await pause(100); }
  }
  check(tab, 'Chrome started');
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id) { const callbacks = pending.get(message.id); pending.delete(message.id); message.error ? callbacks.reject(message.error) : callbacks.resolve(message.result); }
    else if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
    else if (message.method === 'Network.loadingFailed') failures.push(message.params);
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  };
  function cdp(method, params = {}) { return new Promise((resolve, reject) => { const number = ++id; pending.set(number, { resolve, reject }); socket.send(JSON.stringify({ id: number, method, params })); }); }
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function waitFor(expression) {
    for (let attempt = 0; attempt < 150; attempt++) { if (await evaluate(expression)) return; await pause(100); }
    throw new Error(`Timeout: ${expression}`);
  }
  async function navigate(query = '') {
    await cdp('Page.navigate', { url: baseUrl + query });
    await waitFor(`document.querySelectorAll('.brood-token').length === 3 && document.querySelector('#formation-lab')?.dataset.revision === '0'`);
    await pause(200);
  }
  async function point(selector) { return evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`); }
  async function hover(selector) { await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...await point(selector) }); }
  async function click(selector) {
    const position = await point(selector);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...position });
    await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...position });
  }
  async function key(key, code, virtual) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual, ...(key === 'Enter' ? {text:'\r',unmodifiedText:'\r'} : {}) });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual });
  }
  async function snapshot() {
    return evaluate(`(()=>({live:document.querySelector('#live-readout').textContent,revision:Number(document.querySelector('#formation-lab').dataset.revision),used:document.querySelector('#formation-lab').dataset.maneuverUsed==='true',positions:[...document.querySelectorAll('.brood-token')].map(e=>({brood:e.dataset.brood,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),ghosts:[...document.querySelectorAll('.ghost')].map(e=>({brood:e.dataset.brood,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),links:[...document.querySelectorAll('#link-readout li')].map(e=>({text:e.textContent,state:e.dataset.state})),selected:document.querySelector('#selection').textContent,disabled:[...document.querySelectorAll('#maneuvers button')].filter(e=>e.disabled).length,allowance:document.querySelector('#allowance').textContent,preview:document.querySelector('#preview-readout').textContent}))()`);
  }
  async function capture(name) { const screenshot = await cdp('Page.captureScreenshot', { format: 'png' }); await writeFile(join(output, name), Buffer.from(screenshot.data, 'base64')); }
  const label = (value) => value[0].toUpperCase() + value.slice(1);
  await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
  await cdp('Page.bringToFront');
  await cdp('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const version = await cdp('Browser.getVersion');
  await navigate();
  await waitFor(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art==='loaded')`);
  equal(await evaluate(`document.querySelectorAll('#patrol-emblems img').length`), 6, 'all six patrol emblems available');
  equal(await evaluate(`document.querySelectorAll('#fixture option').length`), 12, 'twelve direct test fixtures');
  equal(await evaluate(`Number(document.querySelector('#board-stage').dataset.cells)`), 37, 'board cell count');
  check(await evaluate(`document.documentElement.scrollWidth<=1280&&document.documentElement.scrollHeight<=800`),'default layout fits viewport');
  check(await evaluate(`['header p','.hint','#allowance','#selection','#preview-readout','#link-readout'].every(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.width>0&&r.height>0&&r.top>=0&&r.bottom<=800})`),'instructions and readouts visible');
  await capture('normal.png');
  const fixtureTrace = [];
  for (const [index, formation] of formations().entries()) {
    await evaluate(`(()=>{const e=document.querySelector('#fixture');e.value='${index}';e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    const actual = await snapshot();
    equal(actual.positions, formationPositions(formation), 'labelled anchors match core');
    equal(actual.links, formationLinks(formation).map((link) => ({ state: link.state, text: `${label(link.from.brood)} ↔ ${label(link.to.brood)}: ${label(link.state)} (${link.distance})` })), 'all links match core');
    equal(actual.revision, 0, 'fresh revision'); check(!actual.used, 'fresh allowance');
    equal(await evaluate(`[...document.querySelectorAll('#maneuvers button')].map(e=>({maneuver:e.dataset.maneuver,disabled:e.disabled}))`), ['clockwise','anticlockwise','expand','contract'].map((maneuver) => ({maneuver,disabled:!applyCommand({...createInitialState(),formation},{kind:'maneuver',expectedRevision:0,maneuver}).ok})), 'availability matches core');
    check(await evaluate(`[...document.querySelectorAll('.brood-token')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=1280&&r.top>=0&&r.bottom<=800&&getComputedStyle(e.querySelector('img')).transform==='none'})`), 'tokens/labels on screen, images upright');
    for (const brood of ['ugallu', 'girtablilu', 'pazuzu']) {
      check(await evaluate(`(()=>{const e=document.querySelector('.brood-token[data-brood="${brood}"]');const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.brood-token')===e;})()`), `${formation.shape} ${formation.orientation}: ${brood} pointer-selectable at centre`);
    }
    await capture(`fixture-${index}.png`);
    fixtureTrace.push({ formation, ...actual });
  }
  await click('#reset');
  const initial = await snapshot();
  await hover('[data-maneuver="expand"]'); const preview = await snapshot();
  equal(preview.positions, initial.positions, 'preview leaves live anchors unchanged'); equal(preview.live, initial.live, 'preview leaves live shape/revision unchanged'); check(!preview.used, 'preview leaves allowance');
  equal(preview.ghosts, formationPositions({shape:'spread',orientation:0}), 'exact expansion destinations');
  await capture('expand-preview.png');
  await key('Escape','Escape',27); equal((await snapshot()).ghosts, [], 'Escape cancels preview');
  await evaluate(`document.querySelector('[data-maneuver="clockwise"]').focus()`);
  const rotationPreview = await snapshot(); equal(rotationPreview.ghosts, formationPositions({shape:'compact',orientation:1}), 'focus previews clockwise');
  await key('Enter','Enter',13); const rotation = await snapshot();
  equal(rotation.positions, rotationPreview.ghosts, 'keyboard commit matches rotation preview'); equal(rotation.revision,1,'commit increments once'); check(rotation.used,'commit spends allowance'); equal(rotation.disabled,4,'second maneuver unavailable'); check(rotation.allowance.includes('Maneuver used'),'second maneuver explanation'); equal(rotation.ghosts,[],'commit clears ghosts');
  await click('[data-maneuver="expand"]'); equal(await snapshot(),rotation,'disabled second click changes nothing');
  await click('.brood-token[data-brood="ugallu"]'); check((await snapshot()).selected.includes('Ugallu'),'token selection works');
  await click('#reset'); equal(await snapshot(),initial,'reset restores all live/selection/preview readouts');
  await hover('[data-maneuver="expand"]'); const expansionPreview = await snapshot(); await click('[data-maneuver="expand"]');
  const expansion = await snapshot(); equal(expansion.positions, expansionPreview.ghosts,'expansion committed anchors match preview'); equal(expansion.revision,1,'expansion committed once');
  await capture('spread.png');
  await evaluate(`(()=>{const e=document.querySelector('#fixture');e.value='6';e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const beforeContract = await snapshot();
  await hover('[data-maneuver="contract"]'); const contractionPreview = await snapshot();
  equal(contractionPreview.positions, beforeContract.positions, 'contraction preview leaves live anchors unchanged');
  equal(contractionPreview.ghosts, formationPositions({shape:'compact',orientation:0}), 'exact contraction destinations include ring-two Pazuzu');
  await click('[data-maneuver="contract"]'); const contraction = await snapshot();
  equal(contraction.positions, contractionPreview.ghosts, 'contraction committed anchors match preview');
  equal(contraction.revision, 1, 'contraction committed once');

  await click('#reset'); await hover('[data-maneuver="expand"]'); await click('#cancel'); equal((await snapshot()).ghosts,[],'Cancel control clears preview');
  await hover('[data-maneuver="expand"]'); await click('#reset'); equal((await snapshot()).ghosts,[],'reset clears pending ghosts');
  const beforeDrag = await snapshot();
  const start = await point('.brood-token[data-brood="ugallu"]');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,x:start.x-100,y:start.y-50});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:start.x-100,y:start.y-50});
  // Empty centre cell, using physical pointer input rather than calling application handlers.
  const stage = await evaluate(`(()=>{const r=document.querySelector('#board-stage').getBoundingClientRect();return {x:r.x+380,y:r.y+295};})()`);
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...stage});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...stage});
  const afterDrag = await snapshot(); equal(afterDrag.positions,beforeDrag.positions,'drag/empty click cannot move units'); equal(afterDrag.live,beforeDrag.live,'drag/empty click leaves combat revision/formation'); equal(afterDrag.used,beforeDrag.used,'drag leaves allowance');
  await click('#credits summary');
  for (const selector of ['#credits-file','#license-file']) equal(await evaluate(`fetch(document.querySelector('${selector}').href).then(r=>r.status)`),200,'bundled attribution accessible');
  await evaluate(`document.querySelector('#patrol-emblems').scrollIntoView({block:'end'})`);
  check(await evaluate(`[...document.querySelectorAll('#patrol-emblems .emblem')].every(e=>e.dataset.art==='loaded')`),'six patrol reference emblems loaded');
  await capture('credits.png');
  trace.push({ mode:'normal',initial,preview,rotation,expansion,contractionPreview,contraction,afterDrag,fixtures:fixtureTrace });

  async function repeatSequence(mode) {
    const initial = await snapshot();
    await hover('[data-maneuver="expand"]'); const preview = await snapshot();
    equal(preview.positions,initial.positions,`${mode}: preview leaves live positions`);
    equal(preview.live,initial.live,`${mode}: preview leaves revision/shape`);
    check(!preview.used,`${mode}: preview leaves allowance`);
    await click('#cancel'); equal((await snapshot()).ghosts,[],`${mode}: cancel`);
    await evaluate(`document.querySelector('[data-maneuver="clockwise"]').focus()`);
    const rotationPreview = await snapshot();
    await key('Enter','Enter',13); const rotation = await snapshot();
    equal(rotation.positions,rotationPreview.ghosts,`${mode}: rotation matches focus preview`);
    equal(rotation.revision,1,`${mode}: rotation increments once`); check(rotation.used,`${mode}: allowance spent`);
    equal(rotation.disabled,4,`${mode}: second maneuver unavailable`);
    await click('[data-maneuver="expand"]'); equal(await snapshot(),rotation,`${mode}: disabled second click`);
    await click('.brood-token[data-brood="ugallu"]'); check((await snapshot()).selected.includes('Ugallu'),`${mode}: labelled token selection`);
    await click('#reset'); equal(await snapshot(),initial,`${mode}: reset clears selection and ghosts`);
    await hover('[data-maneuver="expand"]'); const expansionPreview=await snapshot();
    await click('[data-maneuver="expand"]'); const expansion=await snapshot();
    equal(expansion.positions,expansionPreview.ghosts,`${mode}: expansion matches preview`);
    equal(expansion.revision,1,`${mode}: expansion once`);
    await capture(`${mode}.png`);
    trace.push({mode,initial,preview,rotation,expansion});
  }
  const requestIndex = requests.length;
  await navigate('?placeholder=1');
  equal(requests.slice(requestIndex).filter((url)=>url.includes('/tehom/tokens/')),[],'placeholder mode skips image requests');
  check(await evaluate(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art==='placeholder'&&e.querySelector('img').hidden)`),'placeholder tokens identifiable');
  await repeatSequence('placeholder');
  // The visible toggle also restores normal emblems and returns to labels without changing state.
  const beforeToggle = await snapshot(); await click('#placeholder');
  await waitFor(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art==='loaded')`);
  equal(await snapshot(),beforeToggle,'artwork toggle leaves game/session state');
  await click('#placeholder'); equal(await snapshot(),beforeToggle,'return to placeholders leaves state');

  await cdp('Network.setBlockedURLs',{urls:['*tehom/tokens/ugallu.svg']}); await navigate();
  await waitFor(`document.querySelector('.brood-token[data-brood="ugallu"] .emblem').dataset.art==='fallback'`);
  check(await evaluate(`document.querySelector('.brood-token[data-brood="ugallu"] img').hidden`),'failed image hidden, labelled geometry remains');
  await repeatSequence('failed-image');
  equal(exceptions,[],'no uncaught browser exceptions'); check(failures.length>=1,'failed request actually exercised');
  await writeFile(join(output,'browser.json'),JSON.stringify({viewport:{width:1280,height:800},version,assertions,baseUrl,chromeFlags:chrome.spawnargs.slice(1),requests,failures,exceptions,trace},null,2)+'\n');
  console.log(JSON.stringify({ok:true,assertions,fixtures:12,modes:['normal','placeholder','failed-image'],screenshots:18,exceptions:exceptions.length,failedRequests:failures.length,output}));
} finally {
  socket?.close(); chrome.kill('SIGTERM');
  await new Promise((done)=>{if(chrome.exitCode!==null)done();else chrome.once('exit',done)});
  await writeFile(join(output,'chrome-stderr.txt'),diagnostic);
  await rm(profile,{recursive:true,force:true});
}
