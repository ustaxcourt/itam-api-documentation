import { spawn } from 'child_process';
import fetch from 'node-fetch';

let funcProcess;

const isRemote = !!process.env.API_BASE_URL;
const baseUrl = process.env.API_BASE_URL || 'http://localhost:7071';

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
  if (isRemote) {
    console.log(`Using deployed remote function at ${baseUrl}`);
    return; // Doesn't spin up the func start
  }

  console.log('Starting Azure Functions...');
  funcProcess = spawn('func', ['start'], {
    shell: true, // Important for Windows
    stdio: 'inherit', // Show func output in console
  });

  // Wait for the Functions host to respond
  await waitForServer(`${baseUrl}/api/authTest`, 60000);

  // Store process globally for teardown
  global.__FUNC_PROCESS__ = funcProcess;
};
