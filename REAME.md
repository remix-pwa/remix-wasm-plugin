# remix-wasm-plugin

This is a Remix plugin that allows you to use WASM modules in remix with no hassle by bundling them as static assets 
at compile time, improving the speed of your app and allowing for caching of `*.wasm` files.

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

## Configuration

Currently there are two configuration options you can set.

### enabled: boolean 

This option is for wether you want to enable wasm capabilities in your application

### modules: string[]: 

This is an array of wasm modules you want to bundle into your app.

