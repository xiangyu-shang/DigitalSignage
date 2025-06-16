module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/renderer/$1'
  },
  moduleFileExtensions: [
    'js', 
    'json', 
    'vue'
  ],
  testMatch: [
    '**/tests/**/*.spec.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main/index.js',
    '!**/node_modules/**'
  ],
  coverageReporters: [
    'text',
    'html'
  ]
}; 