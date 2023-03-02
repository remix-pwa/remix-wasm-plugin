/**
 * `init` function takes in a two-dimensional array (array in an array)
 *  The type is an InitInput and returns an InitOutput promise.
 * However, that's if you are building your wasm with rust. As of this 
 * time, I haven't tested wasm with any other language so the typing might be different.
 * Hence the use of any
 */
const REDUNDANT: string = ""

export type InitProps = [
  init: any,
  wasm: any
]

export async function initWithProps(...args: InitProps[]) {
  let wasmPromises = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    const init = arg[0];

    const wasm = arg[1];
    
    const promise = init(wasm).then((res: any) => res)
    wasmPromises.push(promise)
  }

  return Promise.all(wasmPromises)
}

// A very unstable api.
// Currently works best with WASM files built with wasm-bindgen
// Cause the algo. refers back to the `wasm.config.js` files, gets
// the bundled wasm modules and locates the wasm and init function itself.
// Currently implemented with the `_bg.wasm` and `$name-of-package.js` pattern
// which wasm-bindgen implements. Still researching on other common approaches in Go, C++, etc.
export function init() {
  // PSEUDOCODE: 
  // locate the wasm config file
  // get the modules from it. 
  // locate the `wasm` folder in the public directory
  // automatically detect the wasm file and the file containing the init function
  // import the init function and the wasm file
  // call the `initWithProps` function above
  // return the promise 
}