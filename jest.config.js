export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',


  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/*config.js"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"]

};
