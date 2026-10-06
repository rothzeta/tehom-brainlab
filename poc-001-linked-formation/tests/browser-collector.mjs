// Additive P17 browser contract checks; the existing browser runner remains unchanged.
// Usage: bun tests/browser-collector.mjs CHROME OUTPUT [BASE_URL].
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createCrucible } from '../src/content/crucible.ts';
import { createPatrol } from '../src/content/patrol.ts';
import { selectRecipients } from '../src/core/intents.ts';
import { applyCommand } from '../src/core/transition.ts';
import { previewCommand } from '../src/core/preview.ts';
import { replayRun } from '../src/core/run-record.ts';
import { ENCOUNTERS } from '../src/core/encounters.ts';
import { collectorFixture, COLLECTOR_TEST_RULES } from './browser/collector-fixtures.ts';
import { createCollector } from '../src/content/collector.ts';
import { formationPositions, formations } from '../src/core/formation.ts';
import { frontCells } from '../src/core/sectors.ts';
import { hexDistance } from '../src/core/hex.ts';
import { abilityLegality } from '../src/core/abilities.ts';
import { ENEMY_ROUTE } from '../src/core/enemy-movement.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME and OUTPUT required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p17-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9247', `--user-data-dir=${profile}`, 'about:blank']);
let socket, assertions = 0, document;
const exceptions = [], evidence = [], pause = ms => new Promise(done => setTimeout(done, ms));
const equal = (a, b, label) => { assertions++; assert.deepEqual(a, b, label); };
const check = (value, label) => { assertions++; assert(value, label); };
const hpText = state => [...state.brood, ...state.enemies].map(e => `${e.id[0].toUpperCase()+e.id.slice(1)} ${e.hp}/${e.maxHp}`).join(' · ');
try {
  let tab;
  for (let i = 0; i < 150; i++) {
    try { tab = await (await fetch('http://localhost:9247/json/new?about:blank', { method: 'PUT' })).json(); break; }
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
    ward:document.querySelector('#protection').textContent,
    enemies:[...document.querySelectorAll('[data-side=enemy]')].map(e=>({id:e.dataset.entity,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)},facing:Number(e.dataset.facing),disabled:e.disabled})),
    rule:document.querySelector('#ability-rule').textContent, preview:document.querySelector('#projection').textContent,
    hp:[...document.querySelectorAll('[data-entity]')].map(e=>({id:e.dataset.entity,hp:Number(e.dataset.hp)})),
    shelters:document.querySelector('#shelters').textContent, phase:document.querySelector('#boss-phase')?.textContent, intentions:document.querySelector('#intentions').textContent, events:[...document.querySelectorAll('#events li')].map(e=>e.dataset.event)}))()`);
  function matches(actual, state) {
    equal(actual.revision, state.revision, 'visible revision matches core');
    equal(actual.enemies.map(({id,cell,facing})=>({id,cell,facing})), state.enemies.map(({id,cell,facing})=>({id,cell,facing})), 'visible enemy tiles/facings match core');
    if ('collectorVersion' in state) for (const relation of state.protections) {
      if (relation.range === undefined) continue;
      const source = state.enemies.find(e=>e.id===relation.sourceId), target = state.enemies.find(e=>e.id===relation.targetId);
      const distance = hexDistance(source.cell, target.cell);
      check(actual.ward.includes(`${distance <= relation.range ? 'in range' : 'out-of-range'} (${distance}/${relation.range})`), 'support readout uses actual tiles/configured range');
    }
    equal(actual.hp, [...state.brood, ...state.enemies].map(({ id, hp }) => ({ id, hp })), 'visible HP matches core');
  }
  async function capture(name) {
    await waitFor(`[...document.querySelectorAll('#tokens .emblem')].every(e=>['loaded','fallback','placeholder'].includes(e.dataset.art))`);
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
    if (input.kind === 'endPhase' && 'collectorVersion' in state) {
      for (const enemy of preview.state.enemies.filter(e=>e.hp>0)) {
        const previous = state.enemies.find(e=>e.id===enemy.id);
        if (previous.cell.q===enemy.cell.q && previous.cell.r===enemy.cell.r) continue;
        equal(await evaluate(`(()=>{const e=document.querySelector('[data-enemy="${enemy.id}"]');return e&&{q:Number(e.dataset.q),r:Number(e.dataset.r)};})()`), enemy.cell, 'destination ghost matches public preview');
      }
      check(shown.preview.includes('Destination ward'), 'destination support appears in preview');
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
    evidence.push({ name, buildRevision: record.buildRevision, commands: replay.commands, phase: state.phase, round: state.round });
  }
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1050, deviceScaleFactor: 1, mobile: false });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  const routeWard = [];
  const logRoute = (state, trace) => {
    const boss = state.enemies.find(e=>e.id==='collector'), ward = state.enemies.find(e=>e.id==='warder');
    routeWard.push({ trace, round:state.round, boss:boss.cell, wardAlive:ward.hp>0,
      distance:hexDistance(boss.cell,ward.cell), range:state.protections.find(e=>e.sourceId==='warder')?.range,
      sweep:state.declaredIntentions.find(e=>e.sourceId==='collector') });
  };
  await navigate('?play=collector');
  let state = createCollector(); matches(await snapshot(), state);
  check(await evaluate(`document.querySelector('header h1').textContent==='TEHOM — Collector'`), 'Collector route title');
  equal(await evaluate(`[...document.querySelector('#preset').options].map(e=>e.value)`), ENCOUNTERS.collector.presets.map(e=>e.id), 'content-defined presets');
  check(await evaluate(`document.querySelector('[data-entity=collector] img').getAttribute('src').endsWith('foundry-mechanism.svg')`), 'Collector emblem');
  await capture('collector-start.png'); logRoute(state,'product');
  for(let round=0;round<2&&state.phase==='player';round++) {
    state = await execute(state,{kind:'endPhase'},round===0?'end-destination-preview.png':undefined);
    logRoute(state,'product'); if(round===0) await capture('collector-round-two.png');
  }
  await exportAttempt('product-attempt.json',state);
  for(const preset of ENCOUNTERS.collector.presets) {
    await evaluate(`document.querySelector('#preset').value=${JSON.stringify(preset.id)};document.querySelector('#preset').dispatchEvent(new Event('change'))`);
    await waitFor(`document.querySelector('#patrol').dataset.revision==='0'`);
    matches(await snapshot(),createCollector(preset.id));
  }
  await navigate('?play=collector&placeholder=1');
  check(await evaluate(`[...document.querySelectorAll('#tokens img')].every(e=>e.hidden)`),'placeholder labels only');
  check(await evaluate(`document.querySelector('header a[href="?play=patrol&placeholder=1"]')!==null`),'header preserves placeholder');
  await capture('collector-placeholder.png');
  // Nonempty unchanged-encounter exports also exercise their live routes.
  for(const [encounter,create] of [['patrol',createPatrol],['crucible',createCrucible]]) {
    await navigate(`?play=${encounter}`); let other=create();
    other=await execute(other,{kind:'maneuver',maneuver:'expand'});
    other=await execute(other,{kind:'endPhase'});
    await exportAttempt(`${encounter}.json`,other);
  }
  // Controlled records and required screenshots stay reachable under default tuning changes.
  await navigate('?play=collector');
  const stylesheet=await evaluate(`document.querySelector('link[rel=stylesheet]').href`);
  const bundle=await Bun.build({entrypoints:[new URL('./browser/collector-fixture.ts',import.meta.url).pathname],target:'browser',minify:true,
    define:{'import.meta.env.BASE_URL':JSON.stringify('./')},plugins:[{name:'existing-stylesheet',setup(builder){
      builder.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));
    }}]});
  check(bundle.success,'controlled fixture compiles');
  document=`<html><head><meta charset="utf-8"><link rel="stylesheet" href="${stylesheet}"></head><body><div id="app"></div><script type="module">${(await bundle.outputs[0].text()).replaceAll('</script','<\\/script')}</script></body></html>`;
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/collector-fixture*',resourceType:'Document'}]});
  await navigate('collector-fixture?mode=trace'); state=collectorFixture('trace');
  await capture('controlled-out-of-range.png'); logRoute(state,'controlled');
  state=await execute(state,{kind:'maneuver',maneuver:'expand'});
  state=await execute(state,{kind:'maneuver',maneuver:'clockwise'});
  state=await execute(state,{kind:'useAbility',actorId:'ugallu',abilityId:'shelter',targetId:'ugallu'});
  state=await execute(state,{kind:'useAbility',actorId:'pazuzu',abilityId:'crosswind',targetId:'collector',direction:'anticlockwise'});
  state=await execute(state,{kind:'endPhase'},'controlled-destination-preview.png');
  logRoute(state,'controlled'); await capture('controlled-in-range.png');
  state=await execute(state,{kind:'useAbility',actorId:'ugallu',abilityId:'claw',targetId:'warder'});
  equal(state.protections,[],'Warder death removes support');
  state=await execute(state,{kind:'endPhase'},'corpse-destination-preview.png');
  logRoute(state,'controlled'); await capture('corpse-after.png');
  await exportAttempt('controlled-relocation.json',state);
  // Use route-relative controlled placements so corpse reachability follows tunable content.
  await navigate('collector-fixture?mode=corpse'); state=collectorFixture('corpse');
  state=await execute(state,{kind:'endPhase'},'corpse-destination-preview.png');
  await capture('corpse-after.png');
  equal(state.enemies.find(e=>e.id==='collector').cell,state.enemies.find(e=>e.id==='warder').cell,'boss occupies corpse cell');
  const hit=await evaluate(`(()=>{const token=document.querySelector('[data-entity=collector]');const r=token.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('[data-entity]')?.dataset.entity;})()`);
  equal(hit,'collector','live boss receives pointer above corpse');
  await exportAttempt('corpse-relocation.json',state);
  await navigate('collector-fixture?mode=in-range'); state=collectorFixture('in-range');
  const command={kind:'useAbility',actorId:'ugallu',abilityId:'claw',targetId:'collector'};
  const before=state; state=await execute(state,command,'configured-ward-preview.png');
  const event=applyCommand(before,{...command,expectedRevision:before.revision}).events.find(e=>e.type==='damage-applied');
  equal(event.directionalReduction,COLLECTOR_TEST_RULES.damageRules.directionalReduction,'live configured reduction differs from ability default');
  await exportAttempt('configured-ward.json',state);
  await navigate('collector-fixture?mode=kill'); state=collectorFixture('kill');
  state=await execute(state,{kind:'useAbility',actorId:'pazuzu',abilityId:'gale',targetId:'collector'},'victory-preview.png');
  equal(state.phase,'victory','boss death immediately wins');
  const actual=await snapshot();check(actual.enemies.every(e=>e.disabled),'all enemy tokens disabled at victory');
  check(await evaluate(`document.querySelector('#end-phase').disabled`),'victory disables resolution');
  equal(state.enemies.filter(e=>e.id!=='collector').map(e=>e.hp),collectorFixture('kill').enemies.filter(e=>e.id!=='collector').map(e=>e.hp),'surviving adds retain HP');
  await capture('victory-adds-disabled.png'); await exportAttempt('boss-victory.json',state);
  // A product playthrough is observational; no assertion pins its opening or outcome pacing.
  await cdp('Fetch.disable'); await navigate('?play=collector'); state=createCollector();
  let rounds=0;
  while(state.phase==='player'&&rounds++<100) {
    // Move once if it reduces incoming damage; keep the committed local sweep as the response target.
    const hpTotal=s=>s.brood.reduce((sum,e)=>sum+e.hp,0);
    const choices=[{kind:'endPhase'},...['clockwise','anticlockwise',state.formation.shape==='compact'?'expand':'contract'].map(maneuver=>({kind:'maneuver',maneuver}))]
      .map(input=>({input,preview:previewCommand(state,{...input,expectedRevision:state.revision},0)})).filter(e=>e.preview.ok);
    const score=e=>hpTotal(e.input.kind==='endPhase'?e.preview.state:e.preview.forecast.kind==='transition'&&e.preview.forecast.ok?e.preview.forecast.state:e.preview.state);
    choices.sort((a,b)=>score(b)-score(a));
    if(choices[0].input.kind!=='endPhase') state=await execute(state,choices[0].input);
    for(const actor of state.brood.filter(e=>e.hp>0)) {
      if(state.phase!=='player')break;
      const abilityId=actor.brood==='ugallu'?'claw':actor.brood==='girtablilu'?'sting':'gale';
      if(abilityLegality(state,{actorId:actor.id,abilityId,targetId:'collector',expectedRevision:state.revision}).ok)
        state=await execute(state,{kind:'useAbility',actorId:actor.id,abilityId,targetId:'collector'});
    }
    if(state.phase==='player')state=await execute(state,{kind:'endPhase'});
  }
  await capture('product-outcome.png'); await exportAttempt('product-playthrough.json',state);
  equal(exceptions,[],'no uncaught browser exceptions');
  await writeFile(join(output,'summary.json'),JSON.stringify({ok:true,assertions,evidence,routeWard,playthrough:{phase:state.phase,round:state.round}},null,2));
  console.log(JSON.stringify({ok:true,assertions,output,playthrough:{phase:state.phase,round:state.round}}));
} finally {
  socket?.close();chrome.kill('SIGTERM');
  if(chrome.exitCode===null)await new Promise(done=>chrome.once('exit',done));
  await rm(profile,{recursive:true,force:true});
}
