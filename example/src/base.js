// Shared interaction behavior for both runtime and DSD element variants.
export default class WebComponentBestPracticesBase extends HTMLElement {
  #nameCode
  #demoActionButton
  #onDemoActionClick
  #usesDeclarativeShadowDom

  constructor() {
    super()

    this.#nameCode = null
    this.#demoActionButton = null
    this.#usesDeclarativeShadowDom = Boolean(this.shadowRoot)
    this.syncShadowBindings()
    this.#onDemoActionClick = () => {
      const interactionType = this.#usesDeclarativeShadowDom ? 'Hydration' : 'Client interaction'

      globalThis.alert?.(`${interactionType} click handled by ${this.tagName.toLowerCase()}`)
    }
  }

  syncShadowBindings() {
    this.#nameCode = this.shadowRoot?.querySelector('h2 code') ?? null
    this.#demoActionButton = this.shadowRoot?.querySelector('[data-demo-action]') ?? null
  }

  static tagName = 'web-component-best-practices'
  static register(name = this.tagName) {
    if (!customElements.get(name)) {
      customElements.define(name, name === this.tagName ? this : class extends this {})
    }
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
