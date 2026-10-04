import { join, resolve } from 'node:path';
import { readFile, mkdir, symlink, writeFile, stat } from 'node:fs/promises';
import { fail, type Plan, type Selection } from '../contracts';
import { help } from '../process';
import { ancestors, claudeHome, localSkills, scan, nestedClaudeRoots, legacyWorkflows } from '../skills';
async function settings(path:string) {
  const body=await readFile(path,'utf8').catch((e)=>{if(e.code==='ENOENT')return null;return fail(2,'unreadable_settings','Cannot read Claude settings',path);});
  if(body===null)return {};
  try {const v=JSON.parse(body);if(!v||typeof v!=='object'||Array.isArray(v))throw Error();return v;}
  catch{return fail(2,'invalid_settings','Invalid Claude settings JSON',path);}
}
const routeRemedy='Explicitly select an allowed route using another supported harness with --route ROUTE_ID, or use an environment with independently verified workflow visibility. resolve --offline inspects selection only and cannot authorize startup.';
function workflowSource(category:string,path:string,reason:string):never {
  return fail(3,'unverified_workflow_source',`Claude worker workflow visibility is unverified for ${category}: ${reason}. ${routeRemedy}`,path);
}
function workflowPlugin(reason:string):never {
  return fail(3,'unfilterable_workflow_plugin',`Claude worker workflow visibility is unverified for an enabled plugin: ${reason}. ${routeRemedy}`,'enabledPlugins');
}
export function validateEffort(effort?:string) {
  if(effort && !['low','medium','high','xhigh','max'].includes(effort))fail(2,'unsupported_effort','Effort is not a verified Claude value','effort');
}
export async function prepare(s:Selection,pass:string[]):Promise<Plan> {
  const {version}=await help('claude',s.cwd,['--model','--effort','--settings','--add-dir']);
  // Installed help omits the documented hidden append-file flag; verified version gate.
  const [major,minor,patch]=version.split('.').map(Number);
  if(major!==2 || minor!==1 || patch<260)fail(3,'unsupported_cli','Claude requires verified append-file and skillOverrides support','claude');
  validateEffort(s.effort);
  if(s.role!=='coordinator') {
    const managed=process.platform==='darwin' ? '/Library/Application Support/ClaudeCode' : process.platform==='win32' ? 'C:\\Program Files\\ClaudeCode' : '/etc/claude-code';
    for(const [category,path,reason] of [
      ['managed settings file',join(managed,'managed-settings.json'),'effective managed skill policy cannot be verified read-only'],
      ['managed settings fragments',join(managed,'managed-settings.d'),'effective managed skill policy cannot be verified read-only'],
      ['enterprise skills',join(managed,'.claude','skills'),'native enterprise skill visibility cannot be verified read-only'],
      ['account-synced skills',join(claudeHome(s.cwd),'skills','synced'),'the local cache cannot establish skills fetched or refreshed during the session, and selective synced-skill hiding is not verified'],
    ]) {
      if(await stat(path).catch(()=>null))workflowSource(category,path,reason);
    }
    // A linked worktree can inherit main-checkout skills outside these local roots.
    if(Bun.which('git') && !(await stat(join(s.repo,'.claude','skills')).catch(()=>null))) {
      const {run}=await import('../process');
      const common=await run(['git','-C',s.cwd,'rev-parse','--git-common-dir'],s.cwd);
      if(common.exit===0 && resolve(s.cwd,common.stdout.trim())!==join(s.repo,'.git'))workflowSource('linked-worktree skill fallback','claude.worktree_skill_fallback','native main-checkout skill discovery has not been verified');
    }
  }
  const extraDirectories:string[]=[];
  for(let i=0;i<pass.length;i++) {
    if(pass[i]==='--add-dir')extraDirectories.push(resolve(s.cwd,pass[++i]));
    else if(pass[i].startsWith('--add-dir='))extraDirectories.push(resolve(s.cwd,pass[i].slice('--add-dir='.length)));
  }
  const nested=await nestedClaudeRoots(s.repo);
  const all=[...await localSkills(s.repo,s.cwd),...(await Promise.all(nested.filter(p=>p.endsWith('skills')).map(scan))).flat(),...(await Promise.all(extraDirectories.flatMap(p=>[join(p,'.claude','skills'),join(p,'.agents','skills')]).map(scan))).flat()];
  const canonical=await scan(join(s.repo,'.agents','skills'));
  if(new Set(canonical.map(x=>x.name)).size!==canonical.length)fail(2,'duplicate_skill','Canonical skill names must be unique','skills');
  const discovered=new Set(all.filter(x=>x.workflow).map(x=>x.name));
  if(s.role!=='coordinator') {
    const commandRoots=[join(claudeHome(s.cwd),'commands'),...ancestors(s.cwd).map(p=>join(p,'.claude','commands')),...extraDirectories.map(p=>join(p,'.claude','commands')),...nested.filter(p=>p.endsWith('commands'))];
    const legacy=await Promise.all(commandRoots.map(legacyWorkflows));
    const legacyIndex=legacy.findIndex(names=>names.length);
    if(legacyIndex!==-1)workflowSource('legacy workflow commands',commandRoots[legacyIndex],'selective native command hiding is unverified; converting commands to inspectable native skills requires separate configuration work');
  }
  const settingsPaths=[join(claudeHome(s.cwd),'settings.json'),...ancestors(s.cwd).reverse().flatMap(p=>[join(p,'.claude','settings.json'),join(p,'.claude','settings.local.json')])];
  let enabledPlugins:Record<string,boolean>={};
  for(const path of settingsPaths) {
    const v=await settings(path);
    for(const name of Object.keys(v.skillOverrides??{}))if(name.startsWith('ruach-workflow-'))discovered.add(name);
    if(v.enabledPlugins)enabledPlugins={...enabledPlugins,...v.enabledPlugins};
  }
  if(s.role!=='coordinator' && Object.values(enabledPlugins).some(Boolean)) {
    const registry=await settings(join(claudeHome(s.cwd),'plugins','installed_plugins.json'));
    for(const [id,enabled] of Object.entries(enabledPlugins)) {
      if(!enabled)continue;
      const installs=registry.plugins?.[id];
      if(!Array.isArray(installs)||!installs.length)workflowPlugin('the enabled installation cannot be inspected');
      for(const entry of installs) {
        if(typeof entry.installPath!=='string')workflowPlugin('its installation path is unavailable');
        const pluginSkills=await scan(resolve(s.cwd,entry.installPath));
        if(pluginSkills.some(x=>x.workflow))workflowPlugin('it contains workflow skills that skillOverrides does not filter');
      }
    }
  }
  const hidden=s.role==='coordinator'?[]:[...discovered].sort();
  const visible=canonical.filter(x=>s.role==='coordinator'||!x.workflow);
  const base=['--model',s.model,'--append-system-prompt-file',s.roleFile];
  if(s.effort)base.push('--effort',s.effort);
  const argv=[...base,'--settings','<private-temp>/settings.json','--add-dir','<private-temp>',...pass];
  return {argv,redactedArgv:argv,coverage:'live-capable',version,hiddenWorkflows:hidden,operations:['private settings.json with workflow visibility overlay','canonical skill symlinks in private .claude/skills'],materialize:async(temp)=>{
    const dir=join(temp,'.claude','skills');await mkdir(dir,{recursive:true,mode:0o700});
    for(const skill of visible)await symlink(skill.path,join(dir,skill.name),'dir');
    await writeFile(join(temp,'settings.json'),JSON.stringify({skillOverrides:Object.fromEntries(hidden.map(n=>[n,'off']))}),{mode:0o600,flag:'wx'});
    return [...base,'--settings',join(temp,'settings.json'),'--add-dir',temp,...pass];
  }};
}
