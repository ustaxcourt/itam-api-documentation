// index.test.js
import * as azureFunctions from '@azure/functions';

// Mock app methods
jest.mock('@azure/functions', () => ({
  app: {
    setup: jest.fn(),
    http: jest.fn(),
  },
}));

describe('index.js setup', () => {
  it('should call app.setup and register HTTP functions', () => {
    require('./index.js'); // Import after mocking

    expect(azureFunctions.app.setup).toHaveBeenCalledWith({
      enableHttpStream: true,
    });

    // Check that HTTP routes were registered
    expect(azureFunctions.app.http).toHaveBeenCalledTimes(5); // number of imports
  });
});
