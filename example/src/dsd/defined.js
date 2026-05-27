import WebComponent from './element.js'

const define = async () => {
  const url = new URL(import.meta.url)
  const name = url.searchParams.get('name') ?? WebComponent.tagName

  WebComponent.register(name)

  return await customElements.whenDefined(name)
}

export default await define()
