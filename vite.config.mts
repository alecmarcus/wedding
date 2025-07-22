import { cloudflare } from "@cloudflare/vite-plugin";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      unstable_mode: "inlineCssInDev",
    }),
    cloudflare({
      viteEnvironment: {
        name: "worker",
      },
    }),
    redwood(),
  ],
});
