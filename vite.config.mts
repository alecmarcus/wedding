import { cloudflare } from "@cloudflare/vite-plugin";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        name: "worker",
      },
    }),
    redwood(),
    vanillaExtractPlugin(),
  ],
});
