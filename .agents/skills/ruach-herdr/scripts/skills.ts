import { readdir, realpath, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fail } from './contracts';
export interface Skill {name:string; path:string; source:string; workflow:boolean}
export async function scan(root:string):Promise<Skill[]> {
  const found:Skill[]=[];const seen=new Set<string>();
  async function visit(path:string,depth:number) {
    const canonical=await realpath(path).catch(()=>null);
    if(!canonical || seen.has(canonical)) return;
    if(depth>20) fail(3,'skill_discovery_unavailable','Skill discovery exceeded traversal limit',root);
    seen.add(canonical);
    const file=join(path,'SKILL.md');
    if((await stat(file).catch(()=>null))?.isFile()) {
      const body=await readFile(file,'utf8');
      const header=body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if(!header) fail(2,'invalid_skill','Skill lacks YAML frontmatter',file);
      let name;
      try { const {parseDocument}=await import('yaml');const doc=parseDocument(header[1],{uniqueKeys:true});if(doc.errors.length)throw Error();name=doc.toJS({maxAliasCount:0}).name; }
      catch { return fail(2,'invalid_skill','Cannot parse skill frontmatter',file); }
      if(typeof name!=='string' || !/^[a-z0-9][a-z0-9-]*$/.test(name)) fail(2,'invalid_skill','Invalid skill name',file);
      found.push({name,path:canonical,source:path,workflow:name.startsWith('ruach-workflow-')});
      return;
    }
    for(const e of await readdir(path,{withFileTypes:true}).catch(()=>[])) {
      if(e.name==='node_modules' || e.name.startsWith('.'))continue;
      if(e.isDirectory()||e.isSymbolicLink())await visit(join(path,e.name),depth+1);
    }
  }
  if((await stat(root).catch(()=>null))?.isDirectory())await visit(root,0);
  return found;
}
export function ancestors(cwd:string) {
  const result:string[]=[];let p=cwd;
  while(true){result.push(p);const next=dirname(p);if(next===p)break;p=next;}
  return result;
}
export function claudeHome(cwd:string) {return process.env.CLAUDE_CONFIG_DIR ? resolve(cwd,process.env.CLAUDE_CONFIG_DIR) : join(homedir(),'.claude');}
export async function localSkills(repo:string,cwd:string) {
  const roots=[join(repo,'.agents','skills'),join(homedir(),'.agents','skills'),join(claudeHome(cwd),'skills'),...ancestors(cwd).flatMap(p=>[join(p,'.agents','skills'),join(p,'.claude','skills')])];
  return (await Promise.all([...new Set(roots)].map(scan))).flat();
}
// Claude discovers nested project skills on later file access. Collect existing
// roots now so their workflow names can be excluded for the whole session.
export async function nestedClaudeRoots(repo:string) {
  const roots:string[]=[];
  const glob=new Bun.Glob('**/.claude/{skills,commands}');
  for await(const path of glob.scan({cwd:repo,dot:true,onlyFiles:false,followSymlinks:false})) {
    if(path.split(/[\\/]/).some(p=>['node_modules','.git','.agents'].includes(p)))continue;
    roots.push(join(repo,path));
  }
  return roots;
}
export async function legacyWorkflows(root:string) {
  const workflows:string[]=[];
  if(!(await stat(root).catch(()=>null))?.isDirectory())return workflows;
  for await(const file of new Bun.Glob('**/*.md').scan({cwd:root,dot:true,followSymlinks:true})) {
    const name=file.replace(/\.md$/,'').split(/[\\/]/).join(':');
    if(name.startsWith('ruach-workflow-'))workflows.push(name);
  }
  return workflows;
}
