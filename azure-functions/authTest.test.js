// authTest.test.js
import { authTest } from './authTest.js';

describe('authTest', () => {
  it('should return 200 and welcome message', async () => {
    const req = {};
    const context = {
      log: jest.fn(),
      error: jest.fn()
    };

    const response = await authTest(req, context);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      message: '✅ You are authenticated. Welcome!'
    });
  });
});
