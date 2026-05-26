const cdnDefinedUrl = 'https://unpkg.com/web-component-best-practices/defined.js?name=cdn-dynamic-name'
const localDefinedUrl = new URL('./src/dsd/defined.js', globalThis.location.href)
const localDynamicDefinedUrl = new URL('./src/dsd/defined.js?name=dynamic-name', globalThis.location.href)

import WebComponent from './element.js'
await import(/* @vite-ignore */ localDefinedUrl.href)
await import(/* @vite-ignore */ localDynamicDefinedUrl.href)
await import(/* @vite-ignore */ cdnDefinedUrl)

WebComponent.register('no-side-effects')
