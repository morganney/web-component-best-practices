import { escapeHtml, normalizeTag } from './utils.js'

export function elemDSD({
  name = 'card-fragment',
  shadowStyles = '',
  componentName = 'web-component-best-practices',
} = {}) {
  const tagName = normalizeTag(name)

  return `
    <${tagName}>
      <template shadowrootmode="open">
        <style>
          ${shadowStyles}
        </style>
        <h2>name: <code>${escapeHtml(componentName)}</code></h2>
        <slot name="registration"></slot>
        <slot></slot>
      </template>
    </${tagName}>
  `
}
