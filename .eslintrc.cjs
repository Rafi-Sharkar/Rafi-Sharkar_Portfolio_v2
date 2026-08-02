module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
  ],
  ignorePatterns: ['.next', 'dist', '.eslintrc.cjs', 'node_modules'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': ['warn', {
      args: 'after-used',
      caughtErrors: 'all',
    }],
  },
};