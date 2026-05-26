const cdnDefinedUrl = 'https://unpkg.com/web-component-best-practices/defined.js?name=cdn-dynamic-name'

import WebComponent from '../element.js'
import '../defined.js'
import '../defined.js?name=dynamic-name'
await import(/* @vite-ignore */ cdnDefinedUrl)

WebComponent.register('no-side-effects')
