import { template } from '../template.js'

export const WebComponentBestPractices = ({ shadowStyles = '' }) => {
  return `
    <web-component-best-practices>
      ${template({ shadowStyles })}
      <code slot="registration">&lt;script type="module"&gt;</code>
      <code slot="registration">&nbsp;&nbsp;import './src/defined.js' // Uses default name</code>
      <code slot="registration">&lt;/script&gt;</code>
      <p>This component is registered as a side effect of importing the module from the './defined.js' entrypoint.</p>
    </web-component-best-practices>
  `
}
