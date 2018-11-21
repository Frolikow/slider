module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.(js)?$': 'babel-jest',
    '^.+\\.hbs$': '<rootDir>/node_modules/handlebars-jest',
  },
  testMatch: [
    '<rootDir>/(**/*.test.(js))',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
