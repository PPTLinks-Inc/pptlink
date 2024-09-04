import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import path from "node:path";
import { createRequire } from "node:module";
import { normalizePath, defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import basicSsl from "@vitejs/plugin-basic-ssl";

const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve("pdfjs-dist/package.json")), "cmaps")
);
const standardFontsDir = normalizePath(
  path.join(
    path.dirname(require.resolve("pdfjs-dist/package.json")),
    "standard_fonts"
  )
);

// https://vitejs.dev/config/
const plugins = [
  react(),
  tailwindcss(),
  viteStaticCopy({
    targets: [
      {
        src: cMapsDir,
        dest: ""
      },
      {
        src: standardFontsDir,
        dest: ""
      }
    ]
  }),
  basicSsl()
];
export default defineConfig({
  plugins: plugins,
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  },
  build: {
    sourcemap: true
  },
  server: {
    proxy: {
      // add proxy for api later
    }
  }
});
