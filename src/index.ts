#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const c = require("ansi-colors");

const { Command } = require("commander");
const program = new Command();

const remixConfigPath = path.join(process.cwd(), "remix.config.js");
const configPath = path.join(process.cwd(), "wasm.config.js");

const isRemixRoot = () => {
  if (!fs.existsSync(remixConfigPath)) {
    console.log(
      c.red.bold(
        "No Remix config file found! Make sure to run in the root of your Remix app"
      )
    );
    return false;
  }

  return true;
};

const run = async () => {
  program
    .name("remix-wasm-plugin")
    .description("A utility module to add WASM capabilities to your Remix app!")
    .version("0.3.5");

  program
    .command("init")
    .description("Initialize a new wasm project in your application")
    .action(() => {
      if (!isRemixRoot()) {
        return;
      }

      const config = `/* WASM.config */
module.exports = {
  enabled: true,
  modules: []
}
`;

      if (!fs.existsSync(configPath)) {
        fs.writeFile(configPath, config, (err: NodeJS.ErrnoException | null) => {
          if (err) throw err;
          console.log(c.blue("WASM config created!"));
        });
      } else {
        console.log(c.cyan("Found wasm.config.js file. Skipping..."));
      }
    });

  program
    .command("build")
    .description("Bundle your WASM modules into your Remix application")
    .action(async () => {
      if (!isRemixRoot()) {
        return;
      }

      if (!fs.existsSync(configPath)) {
        console.log(
          c.white("No WASM config file found! Make sure to run `remix-wasm-plugin init` first")
        );
        return;
      }

      const config: {
        enabled: boolean;
        modules: string[];
      } = require(configPath);

      if (!config.enabled) {
        console.log(c.yellow.bold("WASM is disabled in your config file!"));
        return;
      }

      if (config.modules.length == 0) {
        console.log(
          c.yellow("No WASM modules specified in the `modules` field in wasm.config.js!")
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
              .filter((name: string) =>
                config.modules.map((e) => e.split("/")[0]).includes(name)
              );

            wasm.map((module: string, index: number) => {
              if (module.charAt(0) == "@") {
                module = config.modules[index];
              }

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
              });
            });

            console.log(c.blue("WASM modules built!"));
          }
        }
      );
    });

  program.parse();
};

run();
