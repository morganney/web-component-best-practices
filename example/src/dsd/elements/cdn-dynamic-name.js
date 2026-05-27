import { template } from '../template.js'

export const CdnDynamicName = ({ shadowStyles = '' }) => {
  return `
		<cdn-dynamic-name>
			${template({ shadowStyles, name: 'cdn-dynamic-name' })}
			<code slot="registration">&lt;script type="module"&gt;</code>
			<code slot="registration">&nbsp;&nbsp;import "https://unpkg.com/web-component-best-practices/dsd/defined.js?name=cdn-dynamic-name"</code>
			<code slot="registration">&lt;/script&gt;</code>
			<p>
				This component demonstrates the DSD-specific side effect entrypoint with a CDN URL and dynamic name via
				query parameter.
			</p>
		</cdn-dynamic-name>
	`
}
