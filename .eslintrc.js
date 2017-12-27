module.exports = {
  parserOptions: {
    ecmaVersion: '2017',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
  },
  globals: {},
  extends: ['eslint:recommended'], //, 'plugin:vue/essential'],
  rules: {
    'no-console': 0, // console.log ok
    'no-empty': 0, // catch(e) {}
    'no-unused-vars': ['warn', {argsIgnorePattern: '_$'}],
    'no-extra-semi': 0, // starting a line ok
    'no-var': 'warn', // prefer const and let
    'no-shadow': 'warn', // local variable names must not "mask" identical names from the containing scope
    'guard-for-in': 'warn', // Did you mean: `for of`?
    eqeqeq: ['warn', 'smart'], // ===
  },
  plugins: ['html'],
  env: {
    es6: true,
    // node: true,
    browser: true,
    // 'jest/globals': true,
  },
}
