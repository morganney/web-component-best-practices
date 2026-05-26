import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { elemDSD } from './example/src/dsd/template.js'

const resolvePath = relativePath => fileURLToPath(new URL(relativePath, import.meta.url))
const read = relativePath => readFileSync(new URL(relativePath, import.meta.url), 'utf8').trim()
const renderRegistrationSnippet = lines => lines.map(line => `<code slot="registration">${line}</code>`).join('\n  ')

const renderCardMarkup = ({ name, componentName, registrationSnippet, description }) => {
  const baseMarkup = elemDSD({ name, componentName, shadowStyles })
  const detailsMarkup = `  ${renderRegistrationSnippet(registrationSnippet)}\n  <p>${description}</p>\n`

  return baseMarkup.replace(`</${name}>`, `${detailsMarkup}</${name}>`)
}

const shadowStyles = read('example/src/styles.css')

const cardsMarkup = [
  {
    name: 'no-side-effects',
    componentName: 'no-side-effects',
    registrationSnippet: [
      '&lt;script type="module"&gt;',
      '&nbsp;&nbsp;import WebComponent from "../src/element.js"',
      '&nbsp;&nbsp;WebComponent.register("no-side-effects") // Convenience API',
      '&lt;/script&gt;',
    ],
    description:
      'This component is registered with a static tag name and demonstrates how to create a component without side effects on import. It requires two explicit steps to import the class and then register the custom element, but it provides a more predictable loading flow and better separation of concerns.',
  },
  {
    name: 'web-component-best-practices',
    componentName: 'web-component-best-practices',
    registrationSnippet: [
      '&lt;script type="module"&gt;',
      '&nbsp;&nbsp;import "../src/defined.js" // Uses default name',
      '&lt;/script&gt;',
    ],
    description:
      'This component is registered as a side effect of importing the module from the "../src/defined.js" entrypoint.',
  },
  {
    name: 'dynamic-name',
    componentName: 'dynamic-name',
    registrationSnippet: [
      '&lt;script type="module"&gt;',
      '&nbsp;&nbsp;import "../src/defined.js?name=dynamic-name"',
      '&lt;/script&gt;',
    ],
    description:
      'This component is registered with a custom tag name via query parameter while using the side effect entrypoint.',
  },
  {
    name: 'cdn-dynamic-name',
    componentName: 'cdn-dynamic-name',
    registrationSnippet: [
      '&lt;script type="module"&gt;',
      '&nbsp;&nbsp;import "https://unpkg.com/web-component-best-practices/defined.js?name=cdn-dynamic-name"',
      '&lt;/script&gt;',
    ],
    description:
      'This component demonstrates how to use the side effect entrypoint with a CDN URL and dynamic name via query parameter.',
  },
]
  .map(renderCardMarkup)
  .join('\n')

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
