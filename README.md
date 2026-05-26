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

## Declarative Shadow DOM (DSD) approach

This repo also includes a parser-time DSD variant in `example/dsd.html`.

- `example/dsd.html` is the DSD page template.
- `example/src/dsd/template.js` provides reusable HTML template strings for the component cards.
- `vite.config.js` injects those templates into `<!-- inject:cards -->` at build time.

This gives you true parser-time shadow roots in the generated HTML while keeping the card markup DRY in source.

### Why `example/src/dsd/register.js` exists

Parser-time DSD creates shadow roots from HTML, but custom elements still need to be defined to upgrade and run lifecycle code.

`example/src/dsd/register.js` is a focused bootstrap module that registers all demo tag-name variants used on the DSD page:

1. side-effect registration via `defined.js`
2. dynamic-name registration via `defined.js?name=dynamic-name`
3. explicit registration via `element.js` + `register('no-side-effects')`

Without this bootstrap file, DSD markup would still parse, but the custom elements on that page would not upgrade.

## Tradeoffs

There is a hard constraint triangle for this problem space. Today, you can reliably pick two of these three goals at once: true parser-time DSD, DRY shared markup, and no build/no server composition.

| Keep | Implementation | Tradeoff |
| --- | --- | --- |
| DSD + no build | duplicate markup in each HTML file | not DRY (drift risk) |
| DRY + no build | runtime JS composition/fetch | not true parser-time DSD |
| DSD + DRY | build step or server-side composition | cannot stay no-build/no-server |

For this repo, the DSD path chooses DSD + DRY via build-time composition, while the runtime path keeps separate source files with no required build for local static serving.

## Related example (`youtube-vid`)

For a production-oriented implementation of these patterns, see:

- https://github.com/morganney/youtube-vid

That project demonstrates the same architectural goals with a different packaging decision:

- It uses [Vite asset bundling](https://vitejs.dev/guide/assets#importing-asset-as-string) to include HTML/CSS and reduce runtime requests.
- It also includes an example [CLI copy script](https://github.com/morganney/youtube-vid/blob/main/src/cli.ts) for workflows that prefer shipping static assets separately.

Historical context:

- Original non-bundled implementation: https://github.com/morganney/youtube-vid/tree/3d7b8ac817170cff8bba036c1a938042a0e0b76f
- Example consumer usage in a Next.js app: https://github.com/morganney/morgan.neys.info/commit/9771143e1c7c7e6f82baf0a11948cba5a1304c3f#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R12
