export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*config.js',
    '!jest.setup.js',
    '!jest.teardown.js',
    '!**/tests/integration/**',
    '!**/*.d.ts', // ignores type declaration files from coverage
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },

  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/dist/azure-functions/**/*.test.js'], // Now points to the generated JS files instead of TS
      testPathIgnorePatterns: [
        '/azure-functions/tests/integration/',
        'jest.setup.js',
        'jest.teardown.js',
        '\\.d\\.ts$', // ignores type declaration files for test consideration
      ],
    },
    {
      displayName: 'integration',
      testMatch: ['**/integration/**/*.int.test.js'],
      globalSetup: './jest.setup.js',
      globalTeardown: './jest.teardown.js',
      testTimeout: 60000,
    },
  ],
};
