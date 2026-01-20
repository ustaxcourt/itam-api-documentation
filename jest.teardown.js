import { exec } from 'child_process';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async () => {
  console.log('Stopping Azure Functions...');

  const childP = global.__FUNC_PROCESS__;
  const pid = childP?.pid;

  // Try graceful stop via PID first (cross-platform)
  if (pid) {
    try {
      process.kill(pid, 'SIGINT'); // Ctrl+C equivalent
      await sleep(2000);
      // If still alive, try SIGTERM
      process.kill(pid, 0); // throws if not running
      try {
        process.kill(pid, 'SIGTERM');
      } catch {
        // ignore if SIGTERM fails
      }
      await sleep(1000);
    } catch {
      // Process already stopped or not found—continue
    }
  }

  // Fallback: kill by name (cross‑platform)
  const cmd =
    process.platform === 'win32'
      ? 'taskkill /F /IM func.exe'
      : 'pkill -f "^func( |$)"';

  await new Promise(resolve => {
    exec(cmd, () => resolve()); // ignore errors (usually means not running)
  });

  console.log('Teardown complete.');
};
