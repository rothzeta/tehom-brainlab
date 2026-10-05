// Host Chrome/CDP driver; the application is served by the ordinary Docker wrapper.
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdtemp, readdir, stat } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';

const [suppliedChrome, suppliedOutput, suppliedUrl] = process.argv.slice(2);
const pathDirectories = (process.env.PATH ?? '').split(delimiter);
const chromeNames = ['chrome-headless-shell', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
async function executable(path) {
  try {
    if (!(await stat(path)).isFile()) return false;
    await access(path, constants.X_OK);
    return true;
  } catch { return false; }
}
async function onPath(name) {
  for (const directory of pathDirectories) {
    const path = resolve(directory, name);
    if (await executable(path)) return path;
  }
}
async function discoverChrome() {
  // Preserve the existing explicit-argument precedence over the environment.
  const override = suppliedChrome ?? process.env.POC001_CHROME;
  if (override !== undefined) {
    const path = override.includes('/') ? resolve(override) : await onPath(override);
    if (!override || !path || !(await executable(path))) {
      throw new Error(`Chrome override is not an executable file: ${override}. Set POC001_CHROME=/path/to/chrome-headless-shell or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL].`);
    }
    return { path, reason: suppliedChrome !== undefined ? 'CHROME_PATH argument' : 'POC001_CHROME override' };
  }
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH || join(homedir(), '.cache', 'ms-playwright');
  let entries;
  try { entries = await readdir(cache); }
  catch (error) {
    if (error.code !== 'ENOENT') console.error(`Chrome discovery: cannot read ${cache}: ${error.message}`);
    entries = [];
  }
  const versions = entries.filter(name => /^chromium_headless_shell-\d+$/.test(name));
  versions.sort((a, b) => {
    const left = BigInt(a.slice('chromium_headless_shell-'.length));
    const right = BigInt(b.slice('chromium_headless_shell-'.length));
    return left === right ? (a < b ? -1 : a > b ? 1 : 0) : left > right ? -1 : 1;
  });
  for (const version of versions) {
    const path = resolve(cache, version, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (await executable(path)) return { path, reason: `highest executable Playwright version (${version})` };
  }
  for (const name of chromeNames) {
    const path = await onPath(name);
    if (path) return { path, reason: `${name} on PATH` };
  }
  throw new Error(`No executable Chrome found. Searched ${cache}/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell (highest version first), then ${chromeNames.join(', ')} on PATH (${process.env.PATH ?? ''}). Set POC001_CHROME=/path/to/chrome-headless-shell or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL]. Install Chrome separately; no browser is downloaded automatically.`);
}
const selected = await discoverChrome();
const chrome = selected.path;
console.log(`Chrome selected: ${chrome} (${selected.reason})`);
const output = suppliedOutput !== undefined ? resolve(suppliedOutput) : await mkdtemp(join(tmpdir(), 'p10-browser-'));
console.log(`Browser output: ${output}`);
const port = process.env.POC001_BROWSER_PORT ?? '4173';
const url = suppliedUrl ?? `http://localhost:${port}/`;
let server;
const pause = ms => new Promise(done => setTimeout(done, ms));
async function run(script, directory) {
  const child = spawn(process.execPath, [script, chrome, join(output, directory), url], { stdio: 'inherit' });
  const code = await new Promise((done, fail) => { child.on('error', fail); child.on('exit', done); });
  if (code !== 0) throw new Error(`${script}: exit ${code}`);
}
try {
  if (!suppliedUrl) {
    const dockerEnv = { ...process.env, POC001_MODE: 'docker', POC001_PORT: port };
    console.log('Building a fresh production bundle through the pinned Docker wrapper.');
    const build = spawn('./bin/run', ['build'], { stdio: 'inherit', env: dockerEnv });
    const code = await new Promise((done, fail) => { build.on('error', fail); build.on('exit', done); });
    if (code !== 0) throw new Error(`Build exited ${code}; preview was not started`);
    server = spawn('./bin/run', ['preview'], { stdio: ['ignore', 'pipe', 'pipe'], env: dockerEnv, detached: true });
    let ready = false, announced = false;
    server.stdout.on('data', data => { process.stdout.write(data); if(data.toString().includes('Local:')) announced=true; });
    server.stderr.on('data', data => process.stderr.write(data));
    for (let attempt = 0; attempt < 150; attempt++) {
      if (server.exitCode !== null) throw new Error(`Preview exited ${server.exitCode}`);
      try { if (announced && (await fetch(url)).ok) { ready = true; break; } } catch {}
      await pause(100);
    }
    if (!ready) throw new Error('Preview did not become ready');
  }
  await run('tests/browser-lab.mjs', 'lab');
  await run('tests/browser-preview.mjs', 'preview');
  await run('tests/browser-patrol.mjs', 'patrol');
  await run('tests/browser-run-record.mjs', 'records');
  console.log(JSON.stringify({ ok: true, scripts: 4, output }));
} finally {
  if (server && server.exitCode === null) {
    process.kill(-server.pid, 'SIGINT');
    await new Promise(done => server.once('exit', done));
  }
}
