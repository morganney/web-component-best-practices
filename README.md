# Web Component Best Practices (WIP)

Some best practices regarding web component architecture, development, building and publishing.

## Constraints (self-imposed)

* Use as little tooling as possible.
* ES [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) only.
* Consumable from a [CDN](https://unpkg.com/).
* Consumable as an NPM package that can be included in JavaScript bundles built from tools like Rollup, Webpack, etc.
* Each technology should reside in a separate file:
  * Much of this is simplified if condensed to one JavaScript file, but then development becomes less enjoyable without the niceties provided by modern editors.
  * [Deprecation of HTML Imports](https://developer.chrome.com/blog/chrome-70-deps-rems/) also makes this more of a hassle than it needs to be.

## Architecture

The structure outlined here is to develop with a separation of concerns, and the separation entails distinct files for each technology:

* HTML
* CSS
* JavaScript/TypeScript

Each component can consist of multiple files and possibly more if you include test files with the source code.

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
```

### styles.css

* Your run-of-the-mill CSS file.
* Includes any styling needed by the component's [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).
* Get's imported via a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) inside `template.html` or [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)ed inside `element.js` and `prepend`ed as a [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) element to the component's corresponding [template](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

### template.html

* An HTML file with one parent [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element.
* Includes any elements and [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)'s used by the component.
* Gets [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)ed inside `element.js` and cloned into the component's [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).


### element.js

* A JavaScript or TypeScript file that defines a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) which [`extends`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) an [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).
* Defines the [lifecycle callbacks](https://html.spec.whatwg.org/multipage/custom-elements.html#concept-custom-element-definition-lifecycle-callbacks) invoked for the component's [reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions).
* Uses [top level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await) to delay execution of the component by dependent modules until the component's `template.html` (and possibly `styles.css`) has been [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)ed and parsed.

### defined.js

* A JavaScript or TypeScript file that `import`s the `class` from `element.js` and serves to encapsulate, or call out the [side-effect](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) of registering the component in the global scope.
* Calls [`define`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) to register the component with the [`CustomElementRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).
* Uses [top level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await) to delay execution of the component by dependent modules until the [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) returned from [`CustomElementRegistry.whenDefined`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined) resolves with the component's constructor.


## Publishing

When publishing a web component to a registry like npm, a script located in the bin directory can be used to move static assets to their appropriate location. Usually the statics will be served by a CDN or web server/reverse-proxy like Nginx. The published script can be used by clients in their CD pipeline when building the application using the web component.
