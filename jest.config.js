module.exports = {
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  'transform': {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'testRegex': '/src/.*\\.(test|spec).(ts|tsx|js)$',
  'collectCoverageFrom': ['src/**/*.{js,jsx,tsx,ts}', '!**/node_modules/**', '!**/vendor/**'],
  'coverageReporters': ['json', 'lcov']
}
