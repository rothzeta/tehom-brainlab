// Real controls through CDP, plus an isolated test-owned fixed-area rendering fixture.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import { createPatrol } from '../src/content/patrol.ts';
import { applyCommand } from '../src/core/transition.ts';
import { previewCommand, previewFacts } from '../src/core/preview.ts';
import { formationPositions } from '../src/core/formation.ts';
import { frontMask } from '../src/core/sectors.ts';
import { hexDistance } from '../src/core/hex.ts';
import { fixedAreaFixture, outcomeFixture } from './browser/fixtures.ts';

const [chromePath, outputPath, baseUrl = 'http://localhost:4173/'] = process.argv.slice(2);
assert(chromePath && outputPath, 'CHROME_PATH and OUTPUT_DIRECTORY required');
const output = resolve(outputPath); await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'p10-chrome-'));
const chrome = spawn(chromePath, ['--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--remote-debugging-port=9236', `--user-data-dir=${profile}`, 'about:blank']);
let diagnostic = ''; chrome.stderr.on('data', data => { diagnostic += data; });
let socket, assertions = 0; const exceptions = [], failures = [], requests = [], traces = [], evidence = [], regressions = [];
const pause = ms => new Promise(done => setTimeout(done, ms));
const check = (value, message) => { assertions++; assert(value, message); };
const equal = (actual, expected, message) => { assertions++; assert.deepEqual(actual, expected, message); };
const hpText = state => [...state.brood, ...state.enemies].map(entity => `${entity.id[0].toUpperCase()+entity.id.slice(1)} ${entity.hp}/${entity.maxHp}`).join(' · ');
try {
  let tab;
  for (let i=0; i<150; i++) {
    try { tab = await (await fetch('http://localhost:9236/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${diagnostic}`); await pause(100); }
  }
  check(tab, 'Chrome started'); socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
  let id = 0; const pending = new Map();
  const cdp = (method, params={}) => new Promise((resolve, reject) => {
    const number = ++id; pending.set(number, {resolve, reject}); socket.send(JSON.stringify({id:number, method, params}));
  });
  let interceptedDocument;
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { const callbacks = pending.get(message.id); pending.delete(message.id); message.error ? callbacks.reject(message.error) : callbacks.resolve(message.result); }
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    else if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
    else if (message.method === 'Network.loadingFailed') failures.push(message.params);
    else if (message.method === 'Fetch.requestPaused') {
      cdp('Fetch.fulfillRequest', { requestId: message.params.requestId, responseCode:200,
        responseHeaders:[{name:'Content-Type',value:'text/html; charset=utf-8'}], body:Buffer.from(interceptedDocument).toString('base64') }).catch(error => exceptions.push(error));
    }
  };
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue:true, awaitPromise:true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value;
  }
  async function waitFor(expression) {
    for (let i=0;i<150;i++) { if (await evaluate(expression)) return; await pause(50); }
    await writeFile(join(output, 'timeout.json'), JSON.stringify({expression, exceptions, body:await evaluate('document.body.innerHTML')},null,2));
    throw new Error(`Timeout: ${expression}`);
  }
  async function point(selector) {
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest'})`);
    return evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  }
  async function hover(selector) { await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...await point(selector)}); }
  async function click(selector, count=1) {
    const position = await point(selector);
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...position});
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:count,...position});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:count,...position});
  }
  async function key(key, code=key, text) {
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code,...(text?{text}:{} )});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code});
  }
  async function choosePreset(preset) {
    await click('#preset'); await key('Home');
    for (let i=0;i<['healthy','wounded-ugallu','wounded-girtablilu'].indexOf(preset);i++) await key('ArrowDown');
    await key('Enter','Enter','\r'); await waitFor(`document.querySelector('#preset').value===${JSON.stringify(preset)}`);
  }
  const snapshot = () => evaluate(`(()=>({revision:Number(document.querySelector('#patrol').dataset.revision),phase:document.querySelector('#patrol').dataset.phase,
    round:Number(document.querySelector('#patrol').dataset.round),busy:document.querySelector('#patrol').dataset.busy==='true',
    hp:[...document.querySelectorAll('[data-entity]')].map(e=>({id:e.dataset.entity,hp:Number(e.dataset.hp),maxHp:Number(e.dataset.maxHp)})),
    positions:[...document.querySelectorAll('[data-entity][data-q]')].map(e=>({brood:e.dataset.entity,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),
    ghosts:[...document.querySelectorAll('.ghost')].map(e=>({brood:e.dataset.brood,cell:{q:Number(e.dataset.q),r:Number(e.dataset.r)}})),
    projection:document.querySelector('#projection').textContent,links:document.querySelector('#links').textContent,shelters:document.querySelector('#shelters').textContent,
    selection:document.querySelector('#selection').textContent,protection:document.querySelector('#protection').textContent,feedback:document.querySelector('#feedback').textContent,
    intentions:[...document.querySelectorAll('#intentions li')].map(e=>({source:e.dataset.source,cells:JSON.parse(e.dataset.cells),text:e.textContent})),
    events:[...document.querySelectorAll('#events li')].map(e=>({type:e.dataset.event,source:e.dataset.source,text:e.textContent})),
    controls:[...document.querySelectorAll('#actors button,#abilities button,#targets button,#maneuvers button,#end-phase,#confirm')].map(e=>({disabled:e.disabled,reason:e.dataset.reason,text:e.textContent}))}))()`);
  function stateMatches(actual, expected, label) {
    equal(actual.hp,[...expected.brood,...expected.enemies].map(({id,hp,maxHp})=>({id,hp,maxHp})),`${label}: HP`);
    equal(actual.revision,expected.revision,`${label}: revision`); equal(actual.phase,expected.phase,`${label}: phase`); equal(actual.round,expected.round,`${label}: round`);
    equal(actual.positions,formationPositions(expected.formation),`${label}: positions`);
  }
  async function capture(name) {
    await evaluate('window.scrollTo(0,0)'); await pause(30);
    const result = await cdp('Page.captureScreenshot',{format:'png'});
    await writeFile(join(output,name),Buffer.from(result.data,'base64'));
  }
  async function settled() { await waitFor(`document.querySelector('#patrol').dataset.busy==='false'`); }
  async function previewMatches(state, command, selector, focus=false) {
    const before = await snapshot();
    if (focus) await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`); else await hover(selector);
    const actual = await snapshot(), expected = previewCommand(state,command,0); check(expected.ok, 'controlled preview legal');
    stateMatches(actual,state,'preview isolation');
    equal(actual.hp,before.hp,'preview never spends HP');
    check(actual.projection.includes(`Immediate: ${hpText(expected.state)} · ${expected.state.phase}.`),'immediate projection equals P09');
    equal(actual.ghosts,formationPositions(expected.state.formation),'all projected ghost destinations');
    const projection=expected.projection;
    const pairs=entries=>entries.map(entry=>`${entry.actorId} → ${entry.targetId}`).join('; ')||'none';
    check(actual.projection.includes(`Protection gained: ${pairs(projection.protectionGained)}; lost: ${pairs(projection.protectionLost)}.`),'protection gains and losses equal P09');
    if(projection.after.available) {
      check(actual.projection.includes(`Destination links: ${projection.after.links.map(link=>`${link.from.brood} ↔ ${link.to.brood} ${link.state}`).join('; ')}.`),'preview links equal P09');
      check(actual.projection.includes(`Shelter: ${projection.after.shelters.map(entry=>`${entry.sourceId} → ${entry.targetId}: ${entry.eligible?'eligible':'Close link lost'}`).join('; ')||'none'}.`),'preview Shelter eligibility equal P09');
      check(actual.projection.includes(`Threats: ${projection.after.threats.map(entry=>`${entry.intention.sourceId}: ${entry.intention.kind==='fixed-area'?'fixed cells':'follows creature'} ${entry.cells.map(cell=>`(${cell.q},${cell.r})`).join(',')} → ${entry.recipientIds.join(',')||entry.reason}`).join('; ')}.`),'all projected recipients and anchors equal P09');
    }
    if (expected.forecast.kind==='transition' && expected.forecast.ok) check(actual.projection.includes(`If end phase now: ${hpText(expected.forecast.state)} · ${expected.forecast.state.phase}. Remaining player choices are excluded.`),'conditional forecast equals P09');
    return expected;
  }
  async function play(command, state, duplicate=false, allowRejected=false) {
    const expected=applyCommand(state,command);
    if(!expected.ok) {
      check(allowRejected,'this scenario requires an accepted command');
      const before=await snapshot();
      let selector;
      if(command.kind==='useAbility') {
        selector=`[data-actor="${command.actorId}"]`;
        if(!await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`)) {
          await click(selector); selector=`[data-ability="${command.abilityId}"]`;
          if(!await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`)) {
            await click(selector);
            selector=`[data-target="${command.targetId}"]${command.direction?`[data-direction="${command.direction}"]`:''}`;
          }
        }
      } else selector=command.kind==='maneuver'?`[data-maneuver="${command.maneuver}"]`:'#end-phase';
      check(await evaluate(`document.querySelector(${JSON.stringify(selector)}).disabled`),'core-rejected command is unavailable through its visible control');
      const reason=await evaluate(`document.querySelector(${JSON.stringify(selector)}).dataset.reason`);
      check(reason===expected.error.code || (expected.error.code==='wrong-phase'&&reason===`Battle ${state.phase}`),'unavailable reason matches the core rejection');
      await click(selector); await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10});
      const actual=await snapshot(); stateMatches(actual,expected.state,'visible rejection');
      equal(actual.events,before.events,'rejected activation emits no new effects');
      return expected.state;
    }
    if (command.kind==='useAbility') {
      await click(`[data-actor="${command.actorId}"]`); await click(`[data-ability="${command.abilityId}"]`);
      const selector = `[data-target="${command.targetId}"]${command.direction?`[data-direction="${command.direction}"]`:''}`;
      await previewMatches(state,command,selector); await click(selector);
      await click('#confirm'); if (duplicate) await click('#confirm',2);
    } else if (command.kind==='maneuver') {
      await previewMatches(state,command,`[data-maneuver="${command.maneuver}"]`); await click(`[data-maneuver="${command.maneuver}"]`);
      if (duplicate) await click(`[data-maneuver="${command.maneuver}"]`,2);
    } else {
      check((await evaluate(`document.querySelector('#end-phase').textContent`)).includes(`(${state.brood.filter(entity=>entity.hp>0&&!state.actedIds.includes(entity.id)).length} actions unused)`),'end phase discloses unused actions');
      await click('#end-phase'); if (duplicate) await click('#end-phase',2);
    }
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10});
    await settled();
    const actual=await snapshot(); stateMatches(actual,expected.state,'visible commit'); equal(actual.ghosts,[],'accepted command clears preview');
    equal(actual.events.map(event=>({type:event.type,...(event.source?{source:event.source}:{})})),
      expected.events.map(event=>({type:event.type,...('sourceId' in event?{source:event.sourceId}:{})})),'all accepted events render in core order');
    if (command.kind==='endPhase') {
      equal(actual.events.filter(event=>event.type==='attack-settled').map(event=>event.source),expected.events.filter(event=>event.type==='attack-settled').map(event=>event.sourceId),'enemy attacks presented in core order');
      check(actual.feedback.includes('Unused actions forfeited'),'visible forfeiture explanation');
      await click('#history summary');
      check(await evaluate(`document.querySelector('#history').open`),'resolution log can be read through visible control');
      check(await evaluate(`[...document.querySelectorAll('#events li')].every(e=>e.getBoundingClientRect().height>0)`),'ordered event evidence is rendered visibly');
      await click('#history summary');
    }
    return expected.state;
  }
  await Promise.all([cdp('Page.enable'),cdp('Runtime.enable'),cdp('Network.enable')]);
  await cdp('Page.bringToFront'); await cdp('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
  const version=await cdp('Browser.getVersion');
  async function navigate(mode='normal') {
    await cdp('Page.navigate',{url:baseUrl+'?play=patrol'+(mode==='placeholder'?'&placeholder=1':'')});
    await waitFor(`document.querySelectorAll('[data-entity]').length===6`);
    await waitFor(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art===${JSON.stringify(mode==='placeholder'?'placeholder':'loaded')})`);
  }
  const fixtureBundles=new Map();
  async function loadFixture(entry,path,mode='normal',params={}) {
    const stylesheet=await evaluate(`document.querySelector('link[rel="stylesheet"]').href`);
    if(!fixtureBundles.has(entry)) {
      const bundle=await Bun.build({entrypoints:[new URL('./browser/'+entry,import.meta.url).pathname],target:'browser',minify:true,define:{'import.meta.env.BASE_URL':JSON.stringify('./')},
        plugins:[{name:'existing-stylesheet',setup(builder){builder.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));}}]});
      check(bundle.success,'isolated fixture compiles'); fixtureBundles.set(entry,await bundle.outputs[0].text());
    }
    interceptedDocument=`<html><head><meta charset="utf-8"><link rel="stylesheet" href="${stylesheet}"></head><body><div id="app"></div><script type="module">${fixtureBundles.get(entry).replaceAll('</script','<\\/script')}</script></body></html>`;
    await cdp('Fetch.enable',{patterns:[{urlPattern:'*/'+path+'*',resourceType:'Document'}]});
    const query=new URLSearchParams({...params,...(mode==='placeholder'?{placeholder:'1'}:{})});
    await cdp('Page.navigate',{url:baseUrl+path+'?'+query});
    await waitFor(`document.querySelectorAll('[data-entity]').length===6`);
    await waitFor(`[...document.querySelectorAll('.emblem')].every(e=>e.dataset.art===${JSON.stringify(mode==='placeholder'?'placeholder':'loaded')})`);
  }
  async function terminalInputs(state) {
    const actual=await snapshot(); check(actual.controls.every(control=>control.disabled&&control.reason.includes('Battle')),'terminal choices disabled with reason');
    await click('#end-phase'); await click('[data-maneuver="expand"]'); await key('Enter','Enter','\r');
    stateMatches(await snapshot(),state,'terminal physical input cannot change resources or HP');
  }
  async function controlIdentityRegressions(mode) {
    for(const activation of ['Enter','Space']) {
      await click('#reset'); const initial=createPatrol();
      await evaluate(`document.querySelector('[data-maneuver="clockwise"]').focus()`);
      await hover('[data-maneuver="expand"]');
      equal(await evaluate(`document.activeElement.dataset.maneuver`),'clockwise','hover keeps the activated maneuver focused');
      check((await snapshot()).projection.includes('Pending: Expand.'),'another maneuver really replaces the pending preview');
      await key(activation==='Enter'?'Enter':' ',activation,activation==='Enter'?'\r':' ');
      await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10}); await settled();
      const expected=applyCommand(initial,{kind:'maneuver',maneuver:'clockwise',expectedRevision:0});
      check(expected.ok,'focused maneuver is legal'); const actual=await snapshot(); stateMatches(actual,expected.state,`${activation} owns focused clockwise`);
      regressions.push({mode,case:'focused clockwise / hovered expansion',activation,actual});
    }
    for(const choice of [
      {actor:'ugallu',ability:'claw',target:'warder',hover:'[data-target="censer"]'},
      {actor:'pazuzu',ability:'crosswind',target:'warder',direction:'clockwise',hover:'[data-target="warder"][data-direction="anticlockwise"]'},
      {actor:'ugallu',ability:'claw',target:'warder',hover:'#end-phase'},
    ]) {
      await click('#reset'); const initial=createPatrol();
      await click(`[data-actor="${choice.actor}"]`); await click(`[data-ability="${choice.ability}"]`);
      await click(`[data-target="${choice.target}"]${choice.direction?`[data-direction="${choice.direction}"]`:''}`);
      await evaluate(`document.querySelector('#confirm').focus()`); await hover(choice.hover);
      equal(await evaluate(`document.activeElement.id`),'confirm','hover does not change native confirmation focus');
      check(!await evaluate(`document.querySelector('#confirm').disabled`),'selected command remains available when a different command is previewed');
      const before=await snapshot(); stateMatches(before,initial,'selection and foreign preview spend nothing');
      const command={kind:'useAbility',expectedRevision:0,actorId:choice.actor,abilityId:choice.ability,targetId:choice.target,...(choice.direction?{direction:choice.direction}:{})};
      const expected=applyCommand(initial,command); check(expected.ok,'selected ability is legal');
      await key('Enter','Enter','\r'); await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10}); await settled();
      const actual=await snapshot(); stateMatches(actual,expected.state,'Confirm owns selected actor/ability/target/direction');
      equal(actual.protection,`Protection: ${previewFacts(expected.state).protections.filter(entry=>entry.protected).map(entry=>`${entry.actorId} → ${entry.targetId}`).join('; ')||'none'} · Warder facing ${expected.state.enemies[0].facing}`,'Crosswind direction has the selected facing/protection');
      regressions.push({mode,case:'selected ability / different hover',choice,actual});
    }
    await click('#reset'); const initial=createPatrol();
    await evaluate(`document.querySelector('#end-phase').focus()`); await hover('[data-maneuver="expand"]');
    equal(await evaluate(`document.activeElement.id`),'end-phase','End phase retains native focus');
    await key('Enter','Enter','\r'); await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10}); await settled();
    const expected=applyCommand(initial,{kind:'endPhase',expectedRevision:0}); check(expected.ok,'focused end phase is legal');
    const actual=await snapshot(); stateMatches(actual,expected.state,'End phase owns its kind despite maneuver preview');
    regressions.push({mode,case:'focused end phase / hovered maneuver',actual});
  }
  const stored=JSON.parse(await readFile(new URL('../../docs/mailbox/p08-patrol-round-loop/traces.json',import.meta.url),'utf8'));
  for (const mode of ['normal','placeholder']) {
    const requestStart=requests.length; await navigate(mode);
    for (const preset of ['healthy','wounded-ugallu','wounded-girtablilu']) {
      await choosePreset(preset); const state=createPatrol(preset); const actual=await snapshot(); stateMatches(actual,state,`${mode} ${preset} start`);
      const facts=previewFacts(state); check(facts.available,'initial facts available');
      equal(actual.intentions.map(entry=>({source:entry.source,cells:entry.cells})),facts.threats.map(entry=>({source:entry.intention.sourceId,cells:entry.cells})),'intentions match P08/P09 selectors');
      for (const entity of [...state.brood,...state.enemies]) {
        const selector=`[data-entity="${entity.id}"]`,position=await point(selector);
        const hit=await evaluate(`document.elementFromPoint(${position.x},${position.y})?.closest('[data-entity]')?.dataset.entity`);
        equal(hit,entity.id,'centre cluster and all Brood pointer hit-test separately');
        await click(selector);
        check((await evaluate(`document.querySelector(${JSON.stringify(selector)}).getAttribute('aria-pressed')`))==='true','token pointer selects identity');
        const bounds=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};})()`);
        check(bounds.left>=0&&bounds.right<=1280&&bounds.top>=0&&bounds.bottom<=800,'token fits desktop viewport');
      }
      await click('#reset'); if(mode==='normal') await capture(`${preset}-start.png`); else if(preset==='healthy') await capture('placeholder.png');
      evidence.push({mode,preset,initial:actual});
    }
    await choosePreset('healthy'); await click('#reset');
    const definitions=(await import('../src/content/brood.ts')).ABILITIES;
    for(const actor of createPatrol().brood) {
      await click(`[data-actor="${actor.id}"]`);
      equal(await evaluate(`[...document.querySelectorAll('[data-ability]')].map(e=>e.dataset.ability)`),Object.keys(definitions).filter(id=>definitions[id].brood===actor.brood),'only the two declared abilities for each actor');
    }
    if(mode==='placeholder') equal(requests.slice(requestStart).filter(url=>url.includes('/tokens/')),[],'placeholder requests no token art');
    for (const trace of stored.traces) {
      await choosePreset(trace.preset); await click('#reset'); let state=createPatrol(trace.preset);
      const initial=structuredClone(state), steps=[];
      // Historical commands are inputs, not expectations about current provisional tuning.
      for (const [index,step] of trace.steps.entries()) {
        const command={...step.command,expectedRevision:state.revision}, expected=applyCommand(state,command);
        state=await play(command,state,index===0,true);
        steps.push({command,accepted:expected.ok,error:expected.ok?undefined:expected.error.code,events:expected.events});
      }
      const actual=await snapshot(); stateMatches(actual,state,'current-rule trace final');
      if(state.phase==='victory'||state.phase==='defeat') await terminalInputs(state);
      traces.push({mode,inputs:'current defaults',preset:trace.preset,strategy:trace.strategy,commands:trace.steps.length,initial,steps,final:actual});
      await click('#reset'); stateMatches(await snapshot(),createPatrol(trace.preset),'trace restart');
    }
    // Separate controlled win/loss witnesses, still driven by the recorded command sequences.
    for(const outcome of ['victory','defeat']) {
      await loadFixture('outcome-fixture.ts','p10-outcome-fixture',mode,{outcome});
      let state=outcomeFixture(outcome); stateMatches(await snapshot(),state,'explicit outcome fixture start');
      const initial=structuredClone(state), strategy=outcome==='victory'?'attack':'forfeit';
      const trace=stored.traces.find(trace=>trace.preset==='healthy'&&trace.strategy===strategy), steps=[];
      check(trace,'recorded healthy sequence exists');
      for(const [index,step] of trace.steps.entries()) {
        const command={...step.command,expectedRevision:state.revision}, expected=applyCommand(state,command);
        state=await play(command,state,index===0,true);
        steps.push({command,accepted:expected.ok,error:expected.ok?undefined:expected.error.code,events:expected.events});
      }
      const actual=await snapshot(); stateMatches(actual,state,'controlled trace equals runtime headless result');
      equal(actual.phase,outcome,'explicitly owned encounter reaches required win/loss outcome');
      await terminalInputs(state);
      if(mode==='normal') await capture(outcome==='victory'?'victory.png':'defeat.png');
      traces.push({mode,inputs:'test-owned rules and HP',preset:'healthy',strategy,commands:trace.steps.length,initial,steps,final:actual});
      await click('#reset'); stateMatches(await snapshot(),outcomeFixture(outcome),'controlled terminal restart');
      await cdp('Fetch.disable');
    }
    await navigate(mode);
    await controlIdentityRegressions(mode);
    await choosePreset('healthy'); await click('#reset'); let state=createPatrol();
    // Shelter and a later expansion expose eligibility loss through real previews.
    state=await play({kind:'useAbility',actorId:'ugallu',abilityId:'shelter',targetId:'girtablilu',expectedRevision:state.revision},state);
    const expand={kind:'maneuver',maneuver:'expand',expectedRevision:state.revision};
    await previewMatches(state,expand,'[data-maneuver="expand"]',true);
    check((await snapshot()).projection.includes('Close link lost'),'Shelter loss shown before spending maneuver');
    await key('Escape'); equal((await snapshot()).ghosts,[],'Escape cancels'); stateMatches(await snapshot(),state,'Escape no spend');
    state=await play(expand,state,true);
    check((await evaluate(`document.querySelector('[data-maneuver="clockwise"]').dataset.reason`))==='maneuver-used','used maneuver reason');
    check((await evaluate(`document.querySelector('[data-actor="ugallu"]').dataset.reason`))==='already-acted','used actor reason');
    await click('[data-maneuver="clockwise"]'); stateMatches(await snapshot(),state,'used maneuver pointer rejected');
    state=await play({kind:'useAbility',actorId:'girtablilu',abilityId:'impale',targetId:'warder',expectedRevision:state.revision},state);
    await click('#reset'); state=createPatrol();
    // Protection changes from Crosswind are projected and committed by P09.
    const turn={kind:'useAbility',actorId:'pazuzu',abilityId:'crosswind',targetId:'warder',direction:'clockwise',expectedRevision:0};
    state=await play(turn,state); const projected=previewCommand(createPatrol(),turn,0);
    check(projected.ok,'Crosswind projection available');
    equal((await snapshot()).protection,`Protection: ${projected.projection.after.protections.filter(entry=>entry.protected).map(entry=>`${entry.actorId} → ${entry.targetId}`).join('; ')||'none'} · Warder facing ${state.enemies[0].facing}`,'committed protection/facing equal preview');
    // Reset while command feedback is pending, then wait beyond the old deadline.
    await click('#reset'); await click('#end-phase'); check((await snapshot()).busy,'presentation lock visible');
    await click('#reset'); const reset=await snapshot(); await pause(600); const after=await snapshot();
    stateMatches(after,createPatrol(),'reset during presentation'); equal(after,reset,'old callback cannot change any readout or preview');
    // A pending pointer activation cannot confirm an old preview after a keyboard restart.
    await click('[data-actor="ugallu"]'); await click('[data-ability="claw"]'); await click('[data-target="warder"]');
    const confirmPoint=await point('#confirm');
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...confirmPoint});
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...confirmPoint});
    await evaluate(`document.querySelector('#reset').focus()`); await key('Enter','Enter','\r');
    equal((await snapshot()).ghosts,[],'reset removes old hover/focus preview before another pointer input');
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...confirmPoint});
    stateMatches(await snapshot(),createPatrol(),'old pointer activation after reset');
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10}); await click('#reset');
    // UI inventory and empty-board pointer/drag never provide individual movement.
    equal(await evaluate(`!!document.querySelector('#fixture')`),false,'no free formation fixture');
    const before=await snapshot(); const origin=await point('[data-entity="ugallu"]');
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...origin});
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:origin.x+100,y:origin.y+50,buttons:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:origin.x+100,y:origin.y+50});
    equal((await snapshot()).positions,before.positions,'drag does not move a Brood');
    equal(await evaluate(`[...document.querySelectorAll('#maneuvers button')].map(e=>e.dataset.maneuver)`),['clockwise','anticlockwise','expand','contract'],'only four shared maneuvers');
  }
  // Isolated compiled entry gives this view explicit test-owned fixed and following declarations.
  // Fetch interception supplies the test page only, never mutates production state or dispatches gameplay.
  await navigate();
  await loadFixture('patrol-fixture.ts','p10-owned-fixture');
  await waitFor(`document.querySelectorAll('#intentions li').length===2`);
  let fixture=fixedAreaFixture(); const initial=await snapshot();
  check(initial.intentions[0].text.includes('fixed cells')&&initial.intentions[1].text.includes('follows creature'),'fixed and following labels visible together');
  equal(initial.intentions[0].cells,frontMask(0),'six fixed front cells from public selector');
  check(initial.intentions[0].cells.some(cell=>hexDistance({q:0,r:0},cell)===1)&&initial.intentions[0].cells.some(cell=>hexDistance({q:0,r:0},cell)===2),'telegraph covers both rings');
  const rotate={kind:'maneuver',maneuver:'clockwise',expectedRevision:0};
  await previewMatches(fixture,rotate,'[data-maneuver="clockwise"]',true);
  await click('[data-maneuver="clockwise"]'); await settled(); fixture=applyCommand(fixture,rotate).state;
  const rotated=await snapshot(); equal(rotated.intentions[0].cells,initial.intentions[0].cells,'fixed cells stay fixed after shared rotation');
  equal(rotated.intentions[1].cells,previewFacts(fixture).threats[1].cells,'creature mark follows rotated anchor');
  check(JSON.stringify(rotated.intentions[1].cells)!==JSON.stringify(initial.intentions[1].cells),'following anchor changes');
  await capture('fixed-area.png'); await cdp('Fetch.disable');
  equal(exceptions,[],'no application-origin uncaught errors'); equal(failures,[],'no failed network requests');
  await writeFile(join(output,'browser.json'),JSON.stringify({ok:true,assertions,version,viewport:{width:1280,height:800},traces,regressions,evidence,exceptions,failures,requests},null,2)+'\n');
  console.log(JSON.stringify({ok:true,assertions,traces:traces.length,commands:traces.reduce((sum,trace)=>sum+trace.commands,0),screenshots:7,exceptions:exceptions.length,failures:failures.length,output}));
} finally {
  socket?.close(); chrome.kill('SIGTERM');
  await new Promise(done=>{if(chrome.exitCode!==null)done();else chrome.once('exit',done);});
  await writeFile(join(output,'chrome-stderr.txt'),diagnostic); await rm(profile,{recursive:true,force:true});
}
