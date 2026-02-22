import js from '@eslint/js'
import css from '@eslint/css'
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
      '@html-eslint/indent': ['error', 2],
      '@html-eslint/no-extra-spacing-attrs': 'off',
      '@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
    },
  },
  {
    files: ['**/*.css'],
    language: 'css/css',
    ...css.configs.recommended,
  },
  {
    ignores: ['coverage/**', 'node_modules/**'],
  },
]
