// Host Chrome/CDP driver; the application is served by the ordinary Docker wrapper.
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [chrome = process.env.POC001_CHROME, suppliedOutput, suppliedUrl] = process.argv.slice(2);
if (!chrome) throw new Error('Set POC001_CHROME or pass CHROME_PATH [OUTPUT_DIRECTORY] [BASE_URL].');
const output = suppliedOutput ?? await mkdtemp(join(tmpdir(), 'p10-browser-'));
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
    server = spawn('./bin/run', ['preview'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, POC001_PORT: port }, detached: true });
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
  console.log(JSON.stringify({ ok: true, scripts: 3, output }));
} finally {
  if (server && server.exitCode === null) {
    process.kill(-server.pid, 'SIGINT');
    await new Promise(done => server.once('exit', done));
  }
}
