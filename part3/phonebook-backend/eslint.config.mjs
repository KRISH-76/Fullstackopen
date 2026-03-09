// eslint.config.mjs

import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Allow console.log (needed for backend)
      'no-console': 'off',

      // Allow unused vars that start with _
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Allow require()
      'no-undef': 'error',

      // Turn off strict return checking (not needed here)
      'consistent-return': 'off',

      // Allow dangling underscores (_id etc)
      'no-underscore-dangle': 'off',
    },
  },

  {
    ignores: [
      'dist/**',
      'node_modules/**',
    ],
  },
]