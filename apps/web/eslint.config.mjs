import baseConfig from '@phoenix/eslint-config/react.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      'tailwindcss/no-arbitrary-value': 'warn', // Apps are less strict than packages
    },
  },
];
