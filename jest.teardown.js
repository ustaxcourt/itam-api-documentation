import { exec } from 'child_process';

module.exports = async () => {
  console.log('Stopping Azure Functions...');
  try {
    await new Promise((resolve, reject) => {
      exec('taskkill /F /IM func.exe', error => {
        if (error) {
          console.error('Failed to kill func.exe:', error);
          reject(error);
        } else {
          console.log('Azure Functions stopped.');
          resolve();
        }
      });
    });
  } catch (err) {
    console.error('Error during teardown:', err);
  }
};
