#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

const { Command } = require("commander");
const program = new Command();

const run = async () => {
  const remixConfigPath = path.join(process.cwd(), "remix.config.js");

  program
    .name("remix-wasm-plugin")
    .description("A utility module to add WASM capabilities to your Remix app!")
    .version("0.1.0");

  program
    .command("init")
    .description("Initialize a new wasm project in your application")
    .action(() => {
      if (!fs.existsSync(remixConfigPath)) {
        console.log(
          "No Remix config file found! Make sure to run the commands in the root of your Remix app"
        );
        return;
      }

      const configPath = path.join(process.cwd(), "wasm.config.js");

      const config = `/* WASM.config */
module.exports = {
  enabled: true,
  modules: []
}
`;

      fs.writeFile(configPath, config, (err: Error) => {
        if (err) throw err;
        console.log("WASM config created!");
      });
    });

  program
    .command("build")
    .description("Bundle your WASM modules into your Remix application")
    .action(async () => {
      if (!fs.existsSync(remixConfigPath)) {
        console.log(
          "No Remix config file found! Make sure to run the commands in the root of your Remix app"
        );
        return;
      }
      
      const configPath = path.join(process.cwd(), "wasm.config.js");
      const config: {
        enabled: boolean;
        modules: string[];
      } = require(configPath);

      if (!config.enabled) {
        console.log("WASM is disabled in your config file!");
        return;
      }

      if (config.modules.length == 0) {
        console.log(
          "No WASM modules specified in the `modules` field in wasm.config.js!"
        );
        return;
      }

      const nodeModules = path.join(process.cwd(), "node_modules");

      fs.readdir(
        nodeModules,
        { withFileTypes: true },
        (err: any, files: any) => {
          if (err) {
            throw err;
          } else {
            let wasm: any[] = files
              .filter((dirent: any) => dirent.isDirectory())
              .map((dirent: any) => dirent.name)
              .filter((name: string) => config.modules.includes(name));

            wasm.forEach((module: string) => {
              const wasmPath = path.join(nodeModules, module);
              const wasmDest = path.join(
                process.cwd(),
                "public",
                "wasm",
                module
              );

              if (!fs.existsSync(wasmDest)) {
                fs.mkdirSync(wasmDest, { recursive: true });
              }

              fse.copy(wasmPath, wasmDest, (err: Error) => {
                if (err) throw err;
                console.log(`WASM module ${module} copied!`);
              });
            });
          }
        }
      );
    });

  program.parse();
};

run();
