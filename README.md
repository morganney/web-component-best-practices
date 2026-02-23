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

### `element.js`

- Defines the custom element class (`extends HTMLElement`).
- Handles lifecycle behavior and shadow-root setup.
- Uses [top-level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await) so dependent modules wait for template/styles setup.
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

## Tradeoffs

Keeping HTML/CSS/JS in separate files improves readability and maintenance, but can add extra requests at runtime when unbundled. For production builds, bundling static assets into JavaScript can reduce requests at the cost of tighter coupling to build tooling.

Both approaches are valid—the right choice depends on your deployment constraints and DX priorities.

## Related example (`youtube-vid`)

For a production-oriented implementation of these patterns, see:

- https://github.com/morganney/youtube-vid

That project demonstrates the same architectural goals with a different packaging decision:

- It uses [Vite asset bundling](https://vitejs.dev/guide/assets#importing-asset-as-string) to include HTML/CSS and reduce runtime requests.
- It also includes an example [CLI copy script](https://github.com/morganney/youtube-vid/blob/main/src/cli.ts) for workflows that prefer shipping static assets separately.

Historical context:

- Original non-bundled implementation: https://github.com/morganney/youtube-vid/tree/3d7b8ac817170cff8bba036c1a938042a0e0b76f
- Example consumer usage in a Next.js app: https://github.com/morganney/morgan.neys.info/commit/9771143e1c7c7e6f82baf0a11948cba5a1304c3f#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R12
