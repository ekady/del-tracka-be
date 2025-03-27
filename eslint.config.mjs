import pluginJs from '@eslint/js';
import parserPlugin from '@typescript-eslint/parser';
import importEslint from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  importEslint.flatConfigs.recommended,
  importEslint.flatConfigs.typescript,
  tseslint.configs.base,
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['**/*.{spec.ts}'] },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.build.json',
        },
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: parserPlugin,
      parserOptions: {
        tsconfigRootDir: '.',
        project: './tsconfig.build.json',
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'warn',
      'import/no-unresolved': ['error', { ignore: ['express'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: 'src/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['src/**'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
