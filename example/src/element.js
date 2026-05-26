import { fetchText, getBaseUrl } from './util.js'

const setup = async () => {
  const url = new URL(import.meta.url)
  const baseUrl = getBaseUrl(url)
  const [html, css] = await Promise.all([
    fetchText(`${baseUrl}/template.html`, 'template'),
    fetchText(`${baseUrl}/styles.css?direct`, 'styles'),
  ])
  const parser = new DOMParser()
  const template = parser.parseFromString(html, 'text/html').querySelector('template')
  const style = document.createElement('style')

  style.textContent = css
  template.content.prepend(style)

  // Support both runtime shadow DOM setup and upgrade of pre-parsed DSD roots.
  return class WebComponentBestPractices extends HTMLElement {
    #nameCode
    #demoActionButton
    #onDemoActionClick
    #usesDeclarativeShadowDom

    constructor() {
      super()

      this.#usesDeclarativeShadowDom = Boolean(this.shadowRoot)

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
      }

      this.#nameCode = this.shadowRoot?.querySelector('h2 code') ?? null
      this.#demoActionButton = this.shadowRoot?.querySelector('[data-demo-action]') ?? null
      this.#onDemoActionClick = () => {
        const interactionType = this.#usesDeclarativeShadowDom ? 'Hydration' : 'Client interaction'

        globalThis.alert?.(`${interactionType} click handled by ${this.tagName.toLowerCase()}`)
      }
    }

    static tagName = 'web-component-best-practices'
    static register(name = this.tagName) {
      customElements.define(name, this)
    }

    connectedCallback() {
      const currentTag = this.tagName.toLowerCase()

      if (currentTag !== this.constructor.tagName.toLowerCase()) {
        if (this.#nameCode) {
          this.#nameCode.textContent = currentTag
        }
      }

      if (this.#demoActionButton && this.#onDemoActionClick) {
        this.#demoActionButton.addEventListener('click', this.#onDemoActionClick)
      }
    }

    disconnectedCallback() {
      if (this.#demoActionButton && this.#onDemoActionClick) {
        this.#demoActionButton.removeEventListener('click', this.#onDemoActionClick)
      }
    }
  }
}
export default await setup()
