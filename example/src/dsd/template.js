const escapeHtml = value =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function template({ shadowStyles = '', name = 'web-component-best-practices' } = {}) {
  return `
    <template shadowrootmode="open">
      <style>
        ${shadowStyles}
      </style>
      <h2>name: <code>${escapeHtml(name)}</code></h2>
      <slot name="registration"></slot>
      <slot></slot>
      <button type="button" data-demo-action>Hydration demo</button>
    </template>
  `
}
