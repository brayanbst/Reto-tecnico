import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import * as federationPlugin from "@originjs/vite-plugin-federation";
import { Environment } from "../shared/environment.ts";

const federation = (federationPlugin as unknown as {
  default: (options: Record<string, unknown>) => PluginOption;
}).default;

export default defineConfig(({ mode }) => {
  const env = Environment.shell({
    ...loadEnv(mode, process.cwd(), ""),
    MODE: mode,
  });

  return {
    plugins: [
      react(),
      federation({
        name: "shell",

        remotes: {
          pokemonDetail: env.pokemonDetailRemoteEntry,
          pokemonHistory: env.pokemonHistoryRemoteEntry,
        },

        shared: [
          "react",
          "react-dom",
          "zustand",
          "@tanstack/react-query",
        ],
      }),
    ],

    server: {
      port: env.shellPort,
      strictPort: true,
    },

    build: {
      target: "esnext",
    },
  };
});
