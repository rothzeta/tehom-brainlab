// Host Chrome/CDP driver; the application is served by the ordinary Docker wrapper.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
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
const scripts = (await readdir('tests')).filter(name => /^browser-.*\.mjs$/.test(name)).sort();
if (!scripts.length) throw new Error('No browser harnesses found in tests/browser-*.mjs');
let server;
let serverFinished;
let previewError;
let stoppingPreview = false;
const teardownStderr = [];
const containerName = `poc-001-browser-${randomUUID()}`;
const harnesses = [];
const pause = ms => new Promise(done => setTimeout(done, ms));
function checkPreview() {
  if (previewError) throw previewError;
  if (server && (server.exitCode !== null || server.signalCode !== null)) {
    throw new Error(`Preview exited ${server.exitCode ?? server.signalCode}`);
  }
}
async function run(name) {
  const script = join('tests', name);
  const directory = name === 'browser-run-record.mjs' ? 'records' : name.slice('browser-'.length, -'.mjs'.length);
  console.log(`Running ${script}`);
  const child = spawn(process.execPath, [script, chrome, join(output, directory), url], { stdio: ['inherit', 'pipe', 'inherit'] });
  let stdout = '';
  child.stdout.on('data', data => { stdout += data; process.stdout.write(data); });
  const code = await new Promise((done, fail) => { child.on('error', fail); child.on('close', done); });
  if (code !== 0) throw new Error(`${script}: exit ${code ?? child.signalCode}`);
  const summary = stdout.split('\n').map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).findLast(value => value?.ok === true && Number.isSafeInteger(value.assertions) && value.assertions >= 0);
  if (!summary) throw new Error(`${script}: missing assertion-count summary`);
  console.log(`${script}: ${summary.assertions} assertions passed`);
  return { script, assertions: summary.assertions };
}
try {
  if (!suppliedUrl) {
    const dockerEnv = { ...process.env, POC001_MODE: 'docker', POC001_PORT: port };
    console.log('Building a fresh production bundle through the pinned Docker wrapper.');
    const build = spawn('./bin/run', ['build'], { stdio: 'inherit', env: dockerEnv });
    const code = await new Promise((done, fail) => { build.on('error', fail); build.on('exit', done); });
    if (code !== 0) throw new Error(`Build exited ${code}; preview was not started`);
    server = spawn('./bin/run', ['preview'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...dockerEnv, POC001_CONTAINER_NAME: containerName },
    });
    server.on('error', error => { previewError = error; });
    // Subscribe before readiness polling so teardown cannot miss an early exit.
    serverFinished = new Promise(done => server.once('close', done));
    let ready = false, announced = false;
    server.stdout.on('data', data => { process.stdout.write(data); if(data.toString().includes('Local:')) announced=true; });
    server.stderr.on('data', data => {
      if (stoppingPreview) teardownStderr.push(data);
      else process.stderr.write(data);
    });
    for (let attempt = 0; attempt < 150; attempt++) {
      checkPreview();
      try { if (announced && (await fetch(url)).ok) { ready = true; break; } } catch {}
      await pause(100);
    }
    if (!ready) throw new Error('Preview did not become ready');
  }
  for (const script of scripts) {
    checkPreview();
    harnesses.push(await run(script));
    checkPreview();
  }
} finally {
  if (server && !previewError && server.exitCode === null && server.signalCode === null) {
    // Stop only our container. Sending SIGINT to the attached Docker process
    // group intentionally produced exit 130 during otherwise successful runs.
    console.log(`Stopping browser preview container ${containerName}`);
    stoppingPreview = true;
    let expectedSignalExit = false;
    try {
      const stop = spawn('docker', ['stop', '-t', '5', containerName], { stdio: 'inherit' });
      const code = await new Promise((done, fail) => { stop.on('error', fail); stop.on('close', done); });
      if (code !== 0) throw new Error(`Preview cleanup exited ${code ?? stop.signalCode}`);
      await serverFinished;
      expectedSignalExit = server.exitCode === 143;
      if (server.exitCode !== 0 && !expectedSignalExit) {
        throw new Error(`Preview exited ${server.exitCode ?? server.signalCode} during cleanup`);
      }
    } finally {
      stoppingPreview = false;
      const stderr = Buffer.concat(teardownStderr).toString();
      // Filter only Bun's known diagnostic after a confirmed successful stop.
      process.stderr.write(expectedSignalExit
        ? stderr.replace(/^error: script "preview" exited with code 143(?:\r?\n|$)/gm, '')
        : stderr);
    }
    console.log('Preview stopped (expected)');
  }
}
const assertions = harnesses.reduce((total, harness) => total + harness.assertions, 0);
console.log(`Browser total: ${assertions} assertions passed across ${harnesses.length} harnesses`);
console.log(JSON.stringify({ ok: true, scripts: harnesses.length, assertions, harnesses, output }));
