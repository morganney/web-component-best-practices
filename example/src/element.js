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

  return class WebComponentBestPractices extends HTMLElement {
    #nameCode
    #hydrationDemoButton
    #onHydrationDemoClick

    constructor() {
      super()

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
      }

      this.#nameCode = this.shadowRoot?.querySelector('h2 code') ?? null
      this.#hydrationDemoButton = this.shadowRoot?.querySelector('[data-hydration-demo]') ?? null
      this.#onHydrationDemoClick = () => {
        globalThis.alert?.(`Hydration click handled by ${this.tagName.toLowerCase()}`)
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

      if (this.#hydrationDemoButton && this.#onHydrationDemoClick) {
        this.#hydrationDemoButton.addEventListener('click', this.#onHydrationDemoClick)
      }
    }

    disconnectedCallback() {
      if (this.#hydrationDemoButton && this.#onHydrationDemoClick) {
        this.#hydrationDemoButton.removeEventListener('click', this.#onHydrationDemoClick)
      }
    }
  }
}
export default await setup()
