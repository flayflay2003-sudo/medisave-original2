// @lovable.dev/vite-tanstack-config already includes the needed TanStack/Vite plugins.
// We only set Nitro to target Vercel so Vercel creates the correct server route.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
