import { spawn } from 'child_process';
import fetch from 'node-fetch';

let funcProcess;

async function waitForServer(url, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log('Azure Functions is ready!');
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

module.exports = async () => {
  console.log('Starting Azure Functions...');
  funcProcess = spawn('func', ['start'], {
    shell: true, // Important for Windows
    stdio: 'inherit', // Show func output in console
  });

  // Wait for the Functions host to respond
  await waitForServer('http://localhost:7071/api/authTest', 60000);

  // Store process globally for teardown
  global.__FUNC_PROCESS__ = funcProcess;
};
