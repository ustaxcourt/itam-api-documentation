// authTest.test.js
import { authTest } from './authTest';

describe('authTest function', () => {
  it('should return status 200 and correct message', async () => {
    const response = await authTest(); // No args needed now

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      message: '✅ You are authenticated. Welcome!',
      data: null,
    });
  });
});
