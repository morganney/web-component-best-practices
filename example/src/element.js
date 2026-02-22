const setup = async () => {
  const url = new URL(import.meta.url)
  const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'))
  const baseUrl = `${url.origin}${directory}`
  const [html, css] = await Promise.all([
    fetch(`${baseUrl}/template.html`).then(resp => resp.text()),
    fetch(`${baseUrl}/styles.css`).then(resp => resp.text()),
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

    static name = 'web-component-best-practices'
    static register(name = this.name) {
      customElements.define(name, this)
    }

    connectedCallback() {
      const currentTag = this.tagName.toLowerCase()

      if (currentTag !== this.constructor.name.toLowerCase()) {
        const code = this.shadowRoot.querySelector('code')

        if (code) {
          code.textContent = currentTag
        }
      }
    }
  }
}
export default await setup()
