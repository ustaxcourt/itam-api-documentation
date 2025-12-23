export default {
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
      testMatch: ['**/azure-functions/**/*.test.{js,ts}'], // looks for both TS and JS files while we migrate
      testPathIgnorePatterns: [
        '/azure-functions/tests/integration/',
        'jest.setup.js',
        'jest.teardown.js',
        '\\.d\\.ts$',
      ],
      // force jest to use babel for the JS files and out tsconfig rules on ts-jest for any TS
      transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
      },

      moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }, // a backup to remove file extensions from imports
    },
    {
      displayName: 'integration', // integration tests will run a build first to ensure actual emitted code runs
      testMatch: ['**/integration/**/*.int.test.js'],
      globalSetup: './jest.setup.js',
      globalTeardown: './jest.teardown.js',
      testTimeout: 60000,
    },
  ],
};
