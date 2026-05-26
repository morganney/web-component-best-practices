import js from '@eslint/js'
import html from '@html-eslint/eslint-plugin'
import wc from 'eslint-plugin-wc'
import globals from 'globals'

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      wc,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...wc.configs['flat/best-practice'].rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.html'],
    ...html.configs['flat/recommended'],
    rules: {
      ...html.configs['flat/recommended'].rules,
      '@html-eslint/attrs-newline': 'off',
      '@html-eslint/indent': 'off',
      '@html-eslint/no-extra-spacing-attrs': 'off',
      '@html-eslint/no-extra-spacing-tags': 'off',
      '@html-eslint/use-baseline': 'off',
      '@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
    },
  },
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**'],
  },
]
