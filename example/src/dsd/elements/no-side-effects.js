import { template } from '../template.js'

export const NoSideEffects = ({ shadowStyles = '' }) => {
  return `
    <no-side-effects>
      ${template({ shadowStyles, name: 'no-side-effects' })}
      <code slot="registration">&lt;script type="module"&gt;</code>
      <code slot="registration">&nbsp;&nbsp;import WebComponent from './src/element.js'</code>
      <code slot="registration">&nbsp;&nbsp;WebComponent.register('no-side-effects') // Convenience API</code>
      <code slot="registration">&lt;/script&gt;</code>
      <p>
        This component is registered with a static tag name and demonstrates how to create a component without side
        effects on import. It requires two explicit steps to import the class and then register the custom element,
        but it provides a more predictable loading flow and better separation of concerns.
      </p>
    </no-side-effects>
  `
}
