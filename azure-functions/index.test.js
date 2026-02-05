describe('index.js setup', () => {
  beforeEach(() => {
    // Ensures a fresh module graph for each test
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should call app.setup and register HTTP functions', () => {
    // Gets the real module instance, then spys on its members
    const azureFunctions = require('@azure/functions');

    // Spy on app.setup and app.http before importing index.js
    const setupSpy = jest
      .spyOn(azureFunctions.app, 'setup')
      .mockImplementation(() => {}); // no operation

    const httpSpy = jest
      .spyOn(azureFunctions.app, 'http')
      .mockImplementation(() => {});

    require('./index.js');

    expect(setupSpy).toHaveBeenCalledWith({
      enableHttpStream: true,
    });

    expect(httpSpy).toHaveBeenCalledTimes(6);

    setupSpy.mockRestore();
    httpSpy.mockRestore();
  });
});
