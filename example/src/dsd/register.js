import WebComponent from './element.js'

WebComponent.register(WebComponent.tagName)
WebComponent.register('dynamic-name')
WebComponent.register('no-side-effects')

await import(/* @vite-ignore */ 'https://unpkg.com/web-component-best-practices/dsd/defined.js?name=cdn-dynamic-name')
