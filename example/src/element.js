import { fetchText, getBaseUrl } from './util.js'
import WebComponentBestPracticesBase from './base.js'

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

  return class WebComponentBestPractices extends WebComponentBestPracticesBase {
    constructor() {
      super()

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
        this.syncShadowBindings()
      }
    }
  }
}
export default await setup()
