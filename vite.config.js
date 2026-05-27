import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { NoSideEffects } from './example/src/dsd/elements/no-side-effects.js'
import { WebComponentBestPractices } from './example/src/dsd/elements/web-component-best-practices.js'
import { DynamicName } from './example/src/dsd/elements/dynamic-name.js'
import { CdnDynamicName } from './example/src/dsd/elements/cdn-dynamic-name.js'

const resolvePath = relativePath => fileURLToPath(new URL(relativePath, import.meta.url))
const read = relativePath => readFileSync(new URL(relativePath, import.meta.url), 'utf8').trim()
const shadowStyles = read('example/src/styles.css')
const cardsMarkup = [
  NoSideEffects({ shadowStyles }),
  WebComponentBestPractices({ shadowStyles }),
  DynamicName({ shadowStyles }),
  CdnDynamicName({ shadowStyles }),
].join('\n')
const injectDsdPlugin = {
  name: 'inject-dsd',
  transformIndexHtml(html, ctx) {
    const isDsdPage = ctx?.path?.endsWith('/dsd.html')

    if (!isDsdPage && !html.includes('<!-- inject:cards -->')) {
      return html
    }

    return html.replace('<!-- inject:cards -->', cardsMarkup)
  },
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  root: resolvePath('./example/'),
  publicDir: false,
  plugins: [injectDsdPlugin],
  build: {
    outDir: resolvePath('./dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dsd: resolvePath('./example/dsd.html'),
      },
    },
  },
}))
