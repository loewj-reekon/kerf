import { spawn } from 'node:child_process';

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

const api = spawn(yarn, ['--silent', 'dev:api'], { stdio: ['ignore', 'pipe', 'pipe'] });
for (const stream of [api.stdout, api.stderr]) {
  stream.on('data', (chunk) => {
    for (const line of chunk.toString().split('\n')) {
      if (line.trim()) console.log(`\x1b[36m[api]\x1b[0m ${line}`);
    }
  });
}

const app = spawn(yarn, ['--silent', 'dev:app', ...process.argv.slice(2)], { stdio: 'inherit' });

function shutdown(code = 0) {
  api.kill();
  app.kill();
  process.exit(code);
}

app.on('exit', (code) => shutdown(code ?? 0));
api.on('exit', (code, signal) => {
  console.error(
    `\x1b[31m[api] stopped (${signal ?? `exit code ${code}`}). Restart with \`yarn dev:api\`.\x1b[0m`,
  );
});
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
