import baseConfig from '@phoenix/eslint-config/react.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
