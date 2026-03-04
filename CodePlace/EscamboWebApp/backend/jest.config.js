module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/../tests/unit/**/*.test.js',
    '<rootDir>/../tests/integration/**/*.test.js',
  ],
  coverageDirectory: '<rootDir>/../coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
  ],
  setupFiles: ['dotenv/config'],
};
