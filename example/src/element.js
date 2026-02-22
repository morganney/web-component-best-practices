import { fetchText, getBaseUrl } from './util.js'

const setup = async () => {
  const url = new URL(import.meta.url)
  const baseUrl = getBaseUrl(url)
  const [html, css] = await Promise.all([
    fetchText(`${baseUrl}/template.html`, 'template'),
    fetchText(`${baseUrl}/styles.css`, 'styles'),
  ])
  const parser = new DOMParser()
  const template = parser.parseFromString(html, 'text/html').querySelector('template')
  const style = document.createElement('style')

  style.textContent = css
  template.content.prepend(style)

  return class WebComponentBestPractices extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }

    static tagName = 'web-component-best-practices'
    static register(name = this.tagName) {
      customElements.define(name, this)
    }

    connectedCallback() {
      const currentTag = this.tagName.toLowerCase()

      if (currentTag !== this.constructor.tagName.toLowerCase()) {
        const code = this.shadowRoot.querySelector('code')

        if (code) {
          code.textContent = currentTag
        }
      }
    }
  }
}
export default await setup()
