/**
 * https://eslint.org/docs/latest/user-guide/configuring/configuration-files
 */
module.exports = {
  root: true,

  ignorePatterns: [".eslintrc.js", "postcss.config.js", "webpack.mix.js", 'web/**/*', 'assets/static/**/*'],

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],

  plugins: [],

  env: {
    browser: true,
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 8 // Allows async/await
  },

  // Full list at https://eslint.org/docs/latest/rules/
  rules: {
    // Possible errors
    // These rules relate to possible syntax or logic errors in JavaScript code
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Best practices
    // These rules relate to better ways of doing things to help you avoid problems
    semi: 1,
    indent: ['error', 2],
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': 0
  },

  // globals: {
  //   '$': true,
  //   jQuery: true
  // }
};
