import baseConfig from '@workspace/config-eslint/base.js';
import vue from 'eslint-plugin-vue';

export default [
  ...baseConfig,
  ...vue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
];
