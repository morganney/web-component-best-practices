import { template } from '../template.js'

export const WebComponentBestPractices = ({ shadowStyles = '' }) => {
  return `
    <web-component-best-practices>
      ${template({ shadowStyles })}
      <code slot="registration">&lt;script type="module"&gt;</code>
      <code slot="registration">&nbsp;&nbsp;import WebComponent from './src/element.js'</code>
      <code slot="registration">&nbsp;&nbsp;WebComponent.register(WebComponent.tagName) // Default name</code>
      <code slot="registration">&lt;/script&gt;</code>
      <p>This component uses explicit registration with the default tag name.</p>
    </web-component-best-practices>
  `
}
