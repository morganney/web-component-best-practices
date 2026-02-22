const define = async () => {
  const url = new URL(import.meta.url)
  const name = url.searchParams.get('name') ?? 'web-component-best-practices'
  const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'))
  const baseUrl = `${url.origin}${directory}`
  const element = await import(`${baseUrl}/element.js`)

  /**
   * Support defining multiple custom element names with the same constructor.
   * This also allows for clients to import the element using both the
   * `/defined.js` path and the `/element.js` path on the same page.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#exceptions
   */
  customElements.define(name, class extends element.default {})

  return await customElements.whenDefined(name)
}

export default await define()
