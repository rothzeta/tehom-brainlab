import { fail } from './contracts';
import { json, run } from './process';
// Only connect to an existing daemon. Never bootstrap/start one during preflight.
export async function codexRead(exe: string, cwd: string) {
  const version=await run([exe,'app-server','daemon','version'],cwd);
  if(version.exit!==0 || version.timedOut) fail(3,'codex_config_unavailable','A running local Codex daemon is required for read-only effective configuration','codex');
  const info=json(version.stdout,'codex daemon version');
  if(info.status!=='running' || typeof info.socketPath!=='string' || !info.socketPath.startsWith('/') || info.appServerVersion!==info.cliVersion) fail(3,'codex_config_unavailable','Expected a running matching-version daemon and an absolute local control socket','codex');
  let WebSocket;
  try { ({default:WebSocket}=await import('ws')); }
  catch { return fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','ws'); }
  const ws=new WebSocket(`ws+unix://${info.socketPath}:/`);
  const pending=new Map<number,{resolve:(v:any)=>void,reject:(e:any)=>void}>();
  let id=0;
  const unavailable=()=>new Error('read unavailable');
  const rejectAll=()=>{for(const p of pending.values())p.reject(unavailable());pending.clear();};
  ws.on('error',rejectAll);ws.on('close',rejectAll);
  ws.on('message',(bytes)=>{
    let v;try{v=JSON.parse(bytes.toString());}catch{rejectAll();return;}
    if(!pending.has(v.id)) return;
    const p=pending.get(v.id)!;pending.delete(v.id);
    if(v.error) p.reject(unavailable());else p.resolve(v.result);
  });
  const rpc=(method:string,params:any)=>new Promise<any>((resolve,reject)=>{
    const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}),err=>{if(err){pending.delete(n);reject(err);}});
  });
  const timer=setTimeout(()=>{rejectAll();ws.terminate();},10000);
  try {
    await new Promise<void>((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);ws.once('close',()=>reject(unavailable()));});
    await rpc('initialize',{clientInfo:{name:'ruach-herdr',version:'0.1.0'},capabilities:{experimentalApi:true}});
    ws.send(JSON.stringify({method:'initialized'}));
    const config=await rpc('config/read',{cwd,includeLayers:false});
    const skills=await rpc('skills/list',{cwds:[cwd],forceReload:false});
    return {config:config.config,skills:skills.data};
  } catch { return fail(3,'codex_config_unavailable','Could not read effective configuration and skill catalog from the existing Codex daemon','codex'); }
  finally {clearTimeout(timer);ws.terminate();}
}
