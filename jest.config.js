export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
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
      testMatch: ['**/azure-functions/**/*.test.js'],
      testPathIgnorePatterns: [
        '/azure-functions/tests/integration/',
        'jest.setup.js',
        'jest.teardown.js',
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
