# remix-wasm-plugin

This is a Remix plugin that allows you to use WASM modules in remix with no hassle by bundling them as static assets
at compile time, improving the speed of your app and allowing for caching of `*.wasm` files.

> Currently doesn't support `wasm` in the server. Only client-side packages that run in the browser.

## Installation

```sh
npm i -D remix-wasm-plugin
```

After installation, run:

```sh
npx remix-wasm-plugin init
```

This command initialises a `wasm.config.js` file in your remix root that allows you to further configure
your Remix + WASM experience.

Add this scripts to your `package.json` to build your wasm modules when your app is built:

```json
{
  "scripts": {
    "build:wasm": "remix-wasm-plugin build",
    "dev:wasm": "remix-wasm-plugin build"
  }
}
```

## Usage

To use `remix-wasm-plugin` in your application after initializing you config. file, update your
the `modules` field in the config. with your wasm packages. 

> **The name of the packages should be the same as it appears in your `package.json`.**

```js
/* WASM.config */
module.exports = {
  enabled: true,
  modules: ["my-wasm-package", "my-wasm-package-2", "@remix-run/wasm"]
}
```

If the package is scoped, include it together in the field. e.g `@remix-pwa/client`

Import `initWithProps` from `remix-wasm-plugin` into your `entry.client.{tsx|jsx}` file. Wrap the `hydrateRoot` function with the
`initWithProps` function. After that, you can call functions from your wasm package like any native JS module.

```tsx
import { initWithProps } from "remix-wasm-plugin";
// importing these should be documented in the wasm package
import init, { wasm } from "my-wasm-package"; 
import init2, { wasm2 } from "my-wasm-package-2";

initWithProps([init, wasm], [init2, wasm2]).then(() => {
  hydrateRoot(
    document, 
    <RemixBrowser />
  );
})
```

## API

### initWithProps

This function is used to initialize wasm modules in your application. It takes in arrays of the `init` function and the `wasm` file of your wasm package and returns a promise. After initialization, you can call functions from your wasm package anywhere in your Remix application.

```ts
import { initWithProps } from "remix-wasm-plugin";
import init, { wasm } from "my-wasm-package";
import init2, { wasm2 } from "my-wasm-package-2";
import init3, { wasm3 } from "my-wasm-package-3";

initWithProps([init, wasm], [init2, wasm2], [init3, wasm3]).then(() => {
  hydrateRoot(
    document, 
    <RemixBrowser />
  );
})
```

## Configuration

Currently there are two configuration options you can set.

### enabled: boolean

This option is for wether you want to enable wasm capabilities in your application

### modules: string[]

This is an array of wasm modules you want to bundle into your app.

## FAQ

<details>
<summary><b>But I don't want WASM in my entire app!</b></summary>
Fair enough,...
</details>

