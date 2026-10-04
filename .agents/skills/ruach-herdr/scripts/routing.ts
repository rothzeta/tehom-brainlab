// PROVISIONAL repository YAML shape. Keep all external routing knowledge here.
import { join } from 'node:path';
import { contents, exactKeys, fail, identifier, kinds, efforts, object, string, type Kind } from './contracts';
async function yaml(path: string, root: string) {
  let parseDocument;
  try { ({parseDocument}=await import('yaml')); }
  catch { return fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml'); }
  const doc=parseDocument(await contents(path),{uniqueKeys:true});
  if(doc.errors.length) fail(2,'invalid_yaml','Invalid YAML or duplicate key',path);
  let data;
  try{data=object(doc.toJS({maxAliasCount:0}),path);}catch(e){if(e instanceof Error && e.name==='Failure') throw e;return fail(2,'invalid_yaml','YAML aliases are unsupported',path);}
  exactKeys(data,[root],path);
  const mapping=object(data[root],`${path}:${root}`);
  for(const key of Object.keys(mapping)) identifier(key,`${path}:${root}`);
  return mapping;
}
export async function routed(repo: string, role: string, requested?: string) {
  const models=await yaml(join(repo,'models.yaml'),'models');
  const routes=await yaml(join(repo,'routing.yaml'),'routes');
  const roles=await yaml(join(repo,'roles.yaml'),'roles');
  for(const [id,v] of Object.entries(models)) {
    const f=`models.yaml:models.${id}`, m=object(v,f);
    exactKeys(m,['kind','model','efforts'],f);
    if(!kinds.includes(m.kind)) fail(2,'invalid_kind','Unknown harness kind',`${f}.kind`);
    string(m.model,`${f}.model`);
    if(!Array.isArray(m.efforts) || m.efforts.some((e: any)=>!efforts.includes(e)) || new Set(m.efforts).size!==m.efforts.length) fail(2,'invalid_effort','Expected unique supported effort values',`${f}.efforts`);
  }
  for(const [id,v] of Object.entries(routes)) {
    const f=`routing.yaml:routes.${id}`, r=object(v,f);
    exactKeys(r,['model','effort'],f);identifier(r.model,`${f}.model`);
    if(!Object.hasOwn(models,r.model)) fail(2,'missing_model','Route references a missing model',f);
    const allowed=models[r.model].efforts;
    if(r.effort!==undefined ? !allowed.includes(r.effort) : allowed.length!==0) fail(2,'invalid_effort','Route effort must match model capabilities; omit only for an empty efforts list',f);
  }
  for(const [id,v] of Object.entries(roles)) {
    const f=`roles.yaml:roles.${id}`, r=object(v,f);
    exactKeys(r,['preferred_route'],f);identifier(r.preferred_route,`${f}.preferred_route`);
    if(!Object.hasOwn(routes,r.preferred_route)) fail(2,'missing_route','Role references a missing route',f);
    await contents(join(repo,'.agents','agents',`${id}.md`));
  }
  if(!Object.hasOwn(roles,role)) fail(2,'missing_role','Role is absent from roles.yaml','role');
  const route=requested ?? roles[role].preferred_route;
  if(!Object.hasOwn(routes,route)) fail(2,'missing_route','Requested route is absent','route');
  const r=routes[route],m=models[r.model];
  return {route,kind:m.kind as Kind,model:m.model as string,effort:r.effort as string|undefined,provenance:'provisional repository YAML'};
}
