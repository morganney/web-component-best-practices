import { template } from '../template.js'

export const DynamicName = ({ shadowStyles = '' }) => {
  return `
		<dynamic-name>
			${template({ shadowStyles, name: 'dynamic-name' })}
			<code slot="registration">&lt;script type="module"&gt;</code>
			<code slot="registration">&nbsp;&nbsp;import './src/defined.js?name=dynamic-name'</code>
			<code slot="registration">&lt;/script&gt;</code>
			<p>
				This component is registered with a custom tag name via query parameter while using the side effect
				entrypoint.
			</p>
		</dynamic-name>
	`
}
