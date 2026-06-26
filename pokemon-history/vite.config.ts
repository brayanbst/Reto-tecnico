import { defineConfig, loadEnv, type Plugin, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import * as federationPlugin from "@originjs/vite-plugin-federation";
import { Environment } from "../shared/environment.ts";

const federation = (federationPlugin as unknown as {
  default: (options: Record<string, unknown>) => PluginOption;
}).default;

function patchRemoteEntryCssLoader(): Plugin {
  return {
    name: "patch-remote-entry-federation-output",
    apply: "build",
    generateBundle(_options, bundle) {
      const exposedFileMap = new Map<string, string>();
      const exposedCssMap = new Map<string, string[]>();

      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type === "chunk" &&
          chunk.fileName.includes("__federation_expose_")
        ) {
          const match = chunk.fileName.match(
            /__federation_expose_([A-Za-z0-9_-]+)-/,
          );

          if (match) {
            const exposedModule = `./${match[1]}`;
            exposedFileMap.set(exposedModule, `./${chunk.fileName.split("/").pop()}`);
            const cssPrefix = match[1].replace(/^./, (value) => value.toUpperCase());
            const cssFiles = Object.values(bundle)
              .filter(
                (asset) =>
                  asset.type === "asset" &&
                  asset.fileName.endsWith(".css") &&
                  asset.fileName.includes(cssPrefix),
              )
              .map((asset) => `./${asset.fileName.split("/").pop()}`);
            exposedCssMap.set(exposedModule, cssFiles);
          }
        }
      }

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk" && chunk.fileName.endsWith("remoteEntry.js")) {
          if (chunk.code.includes("e.forEach(")) {
            chunk.code = chunk.code.replace(
              "e.forEach(e=>{",
              "(Array.isArray(e)?e:[e]).forEach(e=>{",
            );
          }

          for (const [exposedModule, fileName] of exposedFileMap.entries()) {
            const placeholder = `"${"${__federation_expose_" + exposedModule + "}"}"`;
            chunk.code = chunk.code.replaceAll(
              placeholder,
              JSON.stringify(fileName),
            );
          }

          for (const [exposedModule, cssFiles] of exposedCssMap.entries()) {
            if (cssFiles.length === 0) {
              continue;
            }

            const cssLoaderPattern = new RegExp(
              String.raw`a\(([^,]+),!1,\`${exposedModule.replace("./", "./").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\`\)`,
              "g",
            );

            chunk.code = chunk.code.replace(
              cssLoaderPattern,
              `a(${JSON.stringify(cssFiles)},!1,\`${exposedModule}\`)`,
            );
          }
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = Environment.pokemonHistory({
    ...loadEnv(mode, process.cwd(), ""),
    MODE: mode,
  });

  return {
    plugins: [
      react(),
      federation({
        name: "pokemon-history",

        filename: "remoteEntry.js",

        exposes: {
          "./PokemonHistory": "./src/exposes/PokemonHistory.ts",
        },

        shared: [
          "react",
          "react-dom",
          "zustand",
          "@tanstack/react-query",
        ],
      }),
      patchRemoteEntryCssLoader(),
    ],

    server: {
      port: env.historyPort,
    },

    build: {
      target: "esnext",
    },
  };
});
