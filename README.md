# progress indicator
![tests](https://github.com/substrate-system/progress-indicator/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/progress-indicator?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![install size](https://packagephobia.com/badge?p=@substrate-system/scroll-progress)](https://packagephobia.com/result?p=@substrate-system/scroll-progress)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-Polyform_Non_Commercial-26bc71?style=flat-square)](LICENSE)


See [an article on piccalil.li/blog](https://piccalil.li/blog/solution-009-progress-indicator)

<!-- toc -->

- [install](#install)
- [example](#example)
- [use](#use)
  * [JS](#js)
  * [CSS](#css)

<!-- tocstop -->

## install

```sh
npm i -S @substrate-system/progress-indicator
```

## example
See [./example/index.html](./example/index.html).

See [the demonstration](https://substrate-system.github.io/progress-indicator/).

![screenshot](image.png)

![screenshot 100%](image-1.png)

This takes an attribute `progress`, which is a percent number from 0 - 100.

```html
<progress-indicator progress="10">
  <div role="alert" aria-live="polite">
    <p>Loading, please wait…</p>
  </div>
</progress-indicator>
```

## use

### JS

This uses the global object `customElements`:

```js
customElements.define('progress-indicator', ProgressIndicator)
```

So the only thing to do is import this file, or link to it in HTML, then you
can use the tag in your HTML.

#### copy

First copy the file to a location accessible to your server:

```sh
cp ./node_modules/@substrate-system/progress-indicator/dist/index.js ./public/progress-indicator.js
```

Then add it to HTML:
```html
  <script type="module" src="./progress-indicator.js"></script>
```

And now you can use the tag in your markup:

```html
<div id="root">
  <progress-indicator progress="0" stroke="8" viewbox="130">
    <div role="alert" aria-live="polite">
      <p>Loading, please wait…</p>
    </div>
  </progress-indicator>
</div>

<script type="module" src="./progress-indicator.js"></script>
```

#### import
If you are using a tool such as `vite`, you can just import, then use in
your HTML.

```js
import '@substrate-system/progress-indicator'
import '@substrate-system/progress-indicator/css'
```

### CSS

Include the CSS also.

#### copy

```sh
cp ./node_modules/@substrate-system/progress-indicator/dist/index.css ./public/progress-indicator.css
```

#### link in HTML

```html
<link rel="stylesheet" crossorigin href="./progress-indicator.css">
```

#### vite
If you are using a tool such as vite, add a link to the css from within
your javascript.

```js
import '@substrate-system/progress-indicator/index.css'
```
