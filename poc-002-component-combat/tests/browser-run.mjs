// CDP/control pattern copied from poc-002-component-combat/tests/browser-battle.mjs (Q05);
// originally copied from poc-001-linked-formation/tests/browser-lab.mjs at c82ec3c.
// Run with Bun: bun tests/browser-run.mjs CHROME_PATH OUTPUT_DIRECTORY [BASE_URL]
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { applyCommand, createFight, createGauntlet, loadContent, parseRecord, replayRecord } from '../src/core/index.ts';
const content = loadContent(JSON.parse(await readFile(new URL('../content/combat-content.v1.json', import.meta.url), 'utf8')));
const parityRun = parseRecord(await readFile(new URL('../fixtures/parity/gauntlet-win-trio-v1.json', import.meta.url), 'utf8'));


const [chromePath, outputPath, baseUrl = 'http://localhost:4273/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY are required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const downloads = join(output, 'downloads'); await mkdir(downloads, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'q08-chrome-'));
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
      try { if (await evaluate(`!document.documentElement?.dataset.previousPage && document.querySelector('canvas')?.width === 1280 && document.querySelector('[data-screen="${screen}"]') !== null`)) return; } catch (error) { if (!String(error).includes('context')) throw error; }
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
  async function confirmWithParity() {
    const expected = await evaluate(`JSON.parse(document.querySelector('[data-preview-events]').dataset.previewEvents)`);
    equal(await evaluate(`document.querySelector('[data-control="confirm"]').disabled`), false, 'legal preview enables Confirm');
    await click('[data-control="confirm"]');
    equal(await evaluate(`JSON.parse(document.querySelector('[data-committed-events]').dataset.committedEvents)`), expected, 'confirmed events exactly equal previewed ordered events');
  }
  async function image(name) {
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(output, name), Buffer.from(shot.data, 'base64'));
  }
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
  let state;
  async function launch(request) {
    await navigate('', 'select');
    // Fill native form controls, then activate the visible launch button.
    await evaluate(`(()=>{const party=${JSON.stringify(request.party)};for(const n of document.querySelectorAll('input[name="party"]'))n.checked=party.includes(n.value);document.querySelector('select[name="encounter"]').value=${JSON.stringify(request.encounterId ?? 'guard')};document.querySelector('select[name="start"]').value=${JSON.stringify(request.start ?? 'fresh')};document.querySelector('form').dispatchEvent(new Event('change',{bubbles:true}))})()`);
    await click(`[data-control="start-${request.kind}"]`);
    state = request.kind === 'fight' ? createFight(content, { party: request.party, encounterId: request.encounterId, start: request.start }) : createGauntlet(content, { party: request.party });
    equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.party`), state.run.party.join(','), 'selected party launches');
    equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.encounter`), state.run.encounters[0], 'selected encounter launches');
  }
  async function download(name) {
    const filename = `poc-002-${state.run.kind}-r${state.revision}.json`;
    const path = join(downloads, filename); await rm(path, {force:true});
    await click('[data-control="export-record"]');
    let record;
    for (let attempt=0; attempt<150; attempt++) {
      try { record = parseRecord(await readFile(path, 'utf8')); break; } catch { await pause(100); }
    }
    assert(record, 'actual JSON download must complete'); assertions++;
    equal(record.finalState, state, `${name}: downloaded state equals current attempt`);
    equal(record.commands.length, state.revision, `${name}: every accepted command recorded`);
    equal(replayRecord(record), {ok:true, state, commands:record.commands.length, events:record.commands.reduce((sum, s)=>sum+s.events.length,0), outcome:state.phase}, `${name}: replay reaches the exact exported state`);
    await writeFile(join(output, `${name}.json`), JSON.stringify(record,null,2)+'\n');
    return record;
  }
  async function command(command) {
    const result = applyCommand(content, state, command);
    assert(result.ok, `scripted command must be legal: ${JSON.stringify(command)}`);
    if (command.kind === 'continue') {
      await click('[data-control="continue-run"]');
    } else {
      if (command.kind === 'endPhase') await click('[data-control="end-phase"]');
      else {
        await click(`[data-actor="${command.actor}"]`);
        const basic = content.brood.find(b=>b.id===command.actor).actions[0];
        if (command.action === basic) await click('[data-control="menu-Attack"]');
        else if (command.action === 'guard') await click('[data-control="menu-Guard"]');
        else if (command.action === 'salve') await click('[data-control="menu-Item"]');
        else { await click('[data-control="menu-Skills"]'); await click(`[data-action="${command.action}"]`); }
        // Compare structured targets rather than escape arbitrary IDs into CSS.
        const targetId = await evaluate(`Array.from(document.querySelectorAll('[data-target]:not(:disabled)')).find(n=>n.dataset.target===${JSON.stringify(JSON.stringify(command.target))})?.dataset.control`);
        assert(targetId, `target must be reachable for ${command.action}`);
        await click(`[data-control=${JSON.stringify(targetId)}]`);
      }
      await confirmWithParity();
    }
    state = result.state;
    equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.revision`), String(state.revision), 'UI revision matches real transition');
    equal(await evaluate(`document.querySelector('[data-screen="run"]').dataset.phase`), state.phase, 'outer flow matches core phase');
  }
  await navigate('', 'select');
  equal(await evaluate(`document.querySelector('details').textContent.includes('CC BY 3.0')`), true, 'selection credits available');
  await click('summary');
  equal(await evaluate(`document.querySelector('details').open`), true, 'credits expand through UI');
  equal(await evaluate(`document.querySelector('details a[href="/tehom/CREDITS.md"]') !== null`), true, 'full attribution reachable');
  await evaluate(`for(const n of document.querySelectorAll('input[name="party"]'))n.checked=false;document.querySelector('form').dispatchEvent(new Event('change',{bubbles:true}))`);
  equal(await evaluate(`document.querySelector('[data-control="start-fight"]').disabled && document.querySelector('[data-control="start-gauntlet"]').disabled`), true, 'empty party cannot launch');
  const parties = [];
  for (let mask=1; mask < 1<<content.brood.length; mask++) parties.push(content.brood.filter((_,i)=>mask&(1<<i)).map(b=>b.id));
  for (let index=0; index<parties.length; index++) {
    const request = {kind:'fight',party:parties[index],encounterId:content.encounters[index].id,start:content.starts[index%content.starts.length].id};
    await launch(request);
    equal(await evaluate(`document.querySelector('[data-screen="battle"]').dataset.start`), request.start, 'selected start launches');
  }
  await download('fight-unfinished');
  await command({kind:'endPhase',expectedRevision:state.revision});
  await click('[data-control="menu-Attack"]');
  equal(await evaluate(`document.querySelector('[data-command]').dataset.command !== 'null'`), true, 'preview present before Reset');
  await click('[data-control="reset-run"]');
  equal(await evaluate(`document.querySelector('[data-screen="select"]') !== null && document.querySelector('[data-screen="run"]') === null`), true, 'Reset disposes attempt and returns selection');
  await click('[data-control="start-fight"]');
  state = createFight(content,{party:content.brood.map(b=>b.id),encounterId:content.encounters[0].id,start:content.starts[0].id});
  equal(await evaluate(`document.querySelector('[data-command]').dataset.command`), 'null', 'fresh attempt has no stale preview');
  equal(await evaluate(`document.querySelector('[data-committed-events]').dataset.committedEvents`), '[]', 'fresh attempt has no old events');
  await download('fight-after-reset');
  // Drive the versioned parity witness entirely through battle controls.
  // Expected numbers live in that fixture; the UI is checked against real transitions.
  await launch({kind:'gauntlet',party:parityRun.run.party});
  await download('gauntlet-before-command');
  let boundaries = 0;
  for (const step of parityRun.commands) {
    await command(step.command);
    if (state.phase === 'between-fights') {
      boundaries++;
      const snapshot = structuredClone(state);
      const record = await download(`gauntlet-between-${boundaries}`);
      equal(record.finalState, snapshot, 'export never advances to next fight');
      equal(await evaluate(`document.querySelector('[aria-label="Attempt result and carried state"]').getBoundingClientRect().height > 0`), true, 'carried summary visibly rendered');
      for (const b of state.party) equal(await evaluate(`document.querySelector('[data-carried-brood="${b.id}"]').textContent.includes(${JSON.stringify(`HP ${b.hp}/${b.maxHp} · Revelation ${b.revelation}/${b.revelationCap}`)})`), true, 'summary displays exact carried HP and Revelation');
      equal(await evaluate(`document.querySelector('[data-control="continue-run"]').hidden`), false, 'Continue available only at boundary');
      await pause(150);
      equal(await evaluate(`document.querySelector('[data-screen="run"]').dataset.fightIndex`), String(state.fightIndex), 'no automatic continuation');
    }
  }
  equal(boundaries, content.gauntlets[0].encounters.length-1, 'all gauntlet boundaries visited');
  equal(state.phase, 'victory', 'full trio gauntlet reaches victory');
  equal(await evaluate(`document.querySelector('[data-control="continue-run"]').hidden`), true, 'final result has no Continue');
  await download('gauntlet-victory'); await image('gauntlet-victory.png');
  await click('[data-control="return-selection"]');
  equal(await evaluate(`document.querySelector('[data-screen="select"]') !== null`), true, 'Return to selection disposes completed attempt');
  // A death during an unfinished multi-member gauntlet remains exportable.
  await launch({kind:'gauntlet',party:content.brood.map(b=>b.id)});
  for (let step=0; !state.party.some(b=>b.hp===0) && state.phase==='player' && step<50; step++) await command({kind:'endPhase',expectedRevision:state.revision});
  equal(state.party.some(b=>b.hp===0) && state.party.some(b=>b.hp>0) && state.phase==='player', true, 'unfinished gauntlet contains a death with survivors');
  await download('gauntlet-after-death-unfinished'); await image('gauntlet-after-death.png');
  while (state.phase==='player') { assert(state.revision<100,'defeat must terminate'); await command({kind:'endPhase',expectedRevision:state.revision}); }
  equal(state.phase,'defeat','defeat ends gauntlet');
  equal(await evaluate(`document.querySelector('[data-control="continue-run"]').hidden`), true, 'defeat has no Continue');
  await download('gauntlet-defeat');
  // Direct URLs receive the same run/export path, preserving Q05's route.
  await navigate('?screen=battle&encounter=guard&party=ugallu&start=wounded','battle');
  state = createFight(content,{encounterId:'guard',party:['ugallu'],start:'wounded'});
  await command({kind:'endPhase',expectedRevision:state.revision});
  await download('direct-fight-mid-combat');
  equal(exceptions, [], 'no browser exceptions');
} finally {
  socket?.close();
  if (chrome.exitCode === null && !launchError) chrome.kill('SIGTERM');
  await closed;
  await rm(profile, { recursive: true, force: true });
}
console.log(JSON.stringify({ ok: true, assertions, output }));
