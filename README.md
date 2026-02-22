# Web Component Best Practices

A practical reference for architecting, developing, and publishing modern HTML custom elements with minimal tooling.

## Constraints (self-imposed)

- Use as little tooling as possible.
- ES [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) only.
- Consumable directly from a [CDN](https://unpkg.com/).
- Consumable as an npm package in bundlers like Vite, Rollup, and Webpack.
- Keep each technology in a separate file (HTML, CSS, JS/TS).

## Architecture

The core pattern is strict separation of concerns:

- **HTML** in `template.html`
- **CSS** in `styles.css`
- **Component class/runtime** in `element.js`
- **Registration side effect** in `defined.js`

Current example layout:

```text
example/
  index.html
  src/
    template.html
    styles.css
    util.js
    element.js
    defined.js
```

### `styles.css`

- Standard CSS for the component [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).
- Loaded by `element.js` and injected into the template as a `<style>` element.

### `template.html`

- One root [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
- Contains component markup and named/default [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) regions.
- Fetched by `element.js` and cloned into shadow DOM.

### `util.js`

- Shared helper utilities used by runtime modules.
- `getBaseUrl(...)` resolves module-relative asset URLs via `import.meta.url`.
- `fetchText(...)` provides explicit fetch error handling for template/styles loading.

### `element.js`

- Defines the custom element class (`extends HTMLElement`).
- Handles lifecycle behavior and shadow-root setup.
- Uses top-level `await` so dependent modules wait for template/styles setup.
- Exposes `register(name?)` for explicit, side-effect-free registration.

### `defined.js`

- Encapsulates the side effect of registration (`customElements.define(...)`).
- Supports dynamic element names through query params (for example `?name=my-element`).
- Uses `whenDefined(...)` and a duplicate-define guard for safer repeated imports.

## Example behavior

`example/index.html` demonstrates four registration patterns with the same underlying component class:

1. **Explicit registration (no side effect)** via `element.js` + `register(...)`
2. **Default side-effect registration** via `defined.js`
3. **Local dynamic name** via `defined.js?name=dynamic-name`
4. **CDN dynamic name** via `defined.js?name=cdn-dynamic-name`

The CDN import is loaded defensively so local HTTP development still works even if the CDN import fails.

## Local development

```bash
npm install
npm run example
```

Then open the served example page and inspect the component variants.

## Publishing

This package is configured to publish the `example/` implementation files.

Useful pre-publish checks:

```bash
npm run lint
npm audit --omit=dev
npm pack --dry-run
```

## Tradeoffs

Keeping HTML/CSS/JS in separate files improves readability and maintenance, but can add extra requests at runtime when unbundled. For production builds, bundling static assets into JavaScript can reduce requests at the cost of tighter coupling to build tooling.

Both approaches are valid—the right choice depends on your deployment constraints and DX priorities.
