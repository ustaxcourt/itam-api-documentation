import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import jestPlugin from 'eslint-plugin-jest';

export default defineConfig([
  // Base config for all JS files
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-var': 'error'
    }

  },

  // ✅ Override for test files
  {
    files: ['**/*.test.js'], // Only applies to test files
    languageOptions: {
      globals: {
        ...globals.jest, // Adds describe, it, expect
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules, // Optional: Jest best practices
    },
  },
]);
