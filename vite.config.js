import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "node:path";
import { createRequire } from "node:module";
import { normalizePath, defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(path.join(path.dirname(require.resolve("pdfjs-dist/package.json")), "cmaps"));
const standardFontsDir = normalizePath(path.join(path.dirname(require.resolve("pdfjs-dist/package.json")), "standard_fonts"));

// https://vitejs.dev/config/
const plugins = [react(), tailwindcss(), viteStaticCopy({
  targets: [{
    src: cMapsDir,
    dest: ""
  }, {
    src: standardFontsDir,
    dest: ""
  }]
}), sentryVitePlugin({
  authToken: "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",
  org: "pptlinks",
  project: "pptlinks-frontend",
})];
export default defineConfig({
  plugins: plugins,
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  },
  build: {
    sourcemap: true
  }
});