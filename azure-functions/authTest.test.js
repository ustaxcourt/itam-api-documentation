// authTest.test.js
import { authTest } from './authTest';

describe('authTest function', () => {
  it('should return status 200 and correct message', async () => {
    const mockReq = {}; // No request data needed for this test
    const mockContext = {};

    const response = await authTest(mockReq, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      message: '✅ You are authenticated. Welcome!'
    });
  });
})
