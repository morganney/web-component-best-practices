# Web Component Best Practices

Some best practices regarding web component architecture, development, building and publishing.

## Constraints (self-imposed)

* Use as little tooling as possible.
* ES modules only.
* Consumable from a CDN.
* Consumable as an NPM package that can be included in JavaScript bundles built from tools like Rollup, Webpack, etc.
* Each technology should reside in a separate file:
  * Much of this is simplified if condensed to one JavaScript file, but then development becomes less enjoyable without the niceties provided by modern editors.
  * [Deprecation of HTML Imports](https://developer.chrome.com/blog/chrome-70-deps-rems/) also makes this more of a hassle than it needs to be.

## Architecture

The structure outlined here is to develop with a separation of concerns, and the separation entails distinct files for each technology:

* HTML
* CSS
* JavaScript/TypeScript

Each component should have at least four files, possibly more if you including test files with source code.

```
src/
  my-component/
    styles.css
    template.html
    element.js
    defined.js
  my-other-component/
    styles.css
    template.html
    element.js
    defined.js
  etc...
```

### styles.css

* Your run-of-the-mill CSS file.
* Includes any styling needed by the component's shadow root.
* Get's imported via a `<link>` inside `template.html`.

### template.html

* An HTML file with one parent `<template>` element.
* Includes any elements and `<slot>`'s used by the component.
* Gets `fetch`ed inside `element.js` and cloned into the component's shadow DOM.
