import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Ignore build folders
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],

    // Extend recommended sets
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    plugins: {
      react,
      reactHooks,
    },

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // ==== React Rules ====
      'react/react-in-jsx-scope': 'off', // For React 17+
      'react/jsx-uses-react': 'off',

      // ==== TypeScript Rules ====
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // ==== React Hooks ====
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ==== Code Quality ====
      'no-unused-vars': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
]);
