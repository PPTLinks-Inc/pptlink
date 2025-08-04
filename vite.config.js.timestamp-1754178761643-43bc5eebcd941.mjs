// vite.config.js
import react from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/tailwindcss/lib/index.js";
import path from "node:path";
import { normalizePath, defineConfig } from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/vite-plugin-static-copy/dist/index.js";
import { createRequire } from "node:module";
import basicSsl from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
import { sentryVitePlugin } from "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var __vite_injected_original_dirname = "/home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks";
var __vite_injected_original_import_meta_url = "file:///home/raymond-amem-aondoakura/Documents/softwares_I/web2_I/pptlinks/vite.config.js";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var cMapsDir = normalizePath(
  path.join(path.dirname(require2.resolve("pdfjs-dist/package.json")), "cmaps")
);
var standardFontsDir = normalizePath(
  path.join(
    path.dirname(require2.resolve("pdfjs-dist/package.json")),
    "standard_fonts"
  )
);
var plugins = [
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
  sentryVitePlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: "pptlinks",
    project: "pptlinks-frontend"
  })
];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // sourcemap: true
  },
  server: {
    proxy: {
      // add proxy for api later
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9yYXltb25kLWFtZW0tYW9uZG9ha3VyYS9Eb2N1bWVudHMvc29mdHdhcmVzX0kvd2ViMl9JL3BwdGxpbmtzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9yYXltb25kLWFtZW0tYW9uZG9ha3VyYS9Eb2N1bWVudHMvc29mdHdhcmVzX0kvd2ViMl9JL3BwdGxpbmtzL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3JheW1vbmQtYW1lbS1hb25kb2FrdXJhL0RvY3VtZW50cy9zb2Z0d2FyZXNfSS93ZWIyX0kvcHB0bGlua3Mvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBub3JtYWxpemVQYXRoLCBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIjtcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tIFwibm9kZTptb2R1bGVcIjtcbmltcG9ydCBiYXNpY1NzbCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsXCI7XG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjtcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IGNNYXBzRGlyID0gbm9ybWFsaXplUGF0aChcbiAgcGF0aC5qb2luKHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoXCJwZGZqcy1kaXN0L3BhY2thZ2UuanNvblwiKSksIFwiY21hcHNcIilcbik7XG5jb25zdCBzdGFuZGFyZEZvbnRzRGlyID0gbm9ybWFsaXplUGF0aChcbiAgcGF0aC5qb2luKFxuICAgIHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoXCJwZGZqcy1kaXN0L3BhY2thZ2UuanNvblwiKSksXG4gICAgXCJzdGFuZGFyZF9mb250c1wiXG4gIClcbik7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5jb25zdCBwbHVnaW5zID0gW1xuICByZWFjdCgpLFxuICB0YWlsd2luZGNzcygpLFxuICB2aXRlU3RhdGljQ29weSh7XG4gICAgdGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBzcmM6IGNNYXBzRGlyLFxuICAgICAgICBkZXN0OiBcIlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzcmM6IHN0YW5kYXJkRm9udHNEaXIsXG4gICAgICAgIGRlc3Q6IFwiXCJcbiAgICAgIH1cbiAgICBdXG4gIH0pLFxuICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxuICAgIG9yZzogXCJwcHRsaW5rc1wiLFxuICAgIHByb2plY3Q6IFwicHB0bGlua3MtZnJvbnRlbmRcIlxuICB9KVxuXTtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IHBsdWdpbnMsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIilcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gc291cmNlbWFwOiB0cnVlXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAvLyBhZGQgcHJveHkgZm9yIGFwaSBsYXRlclxuICAgIH1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJYLE9BQU8sV0FBVztBQUM3WSxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlLG9CQUFvQjtBQUM1QyxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLGNBQWM7QUFDckIsU0FBUyx3QkFBd0I7QUFQakMsSUFBTSxtQ0FBbUM7QUFBcU0sSUFBTSwyQ0FBMkM7QUFTL1IsSUFBTUEsV0FBVSxjQUFjLHdDQUFlO0FBQzdDLElBQU0sV0FBVztBQUFBLEVBQ2YsS0FBSyxLQUFLLEtBQUssUUFBUUEsU0FBUSxRQUFRLHlCQUF5QixDQUFDLEdBQUcsT0FBTztBQUM3RTtBQUNBLElBQU0sbUJBQW1CO0FBQUEsRUFDdkIsS0FBSztBQUFBLElBQ0gsS0FBSyxRQUFRQSxTQUFRLFFBQVEseUJBQXlCLENBQUM7QUFBQSxJQUN2RDtBQUFBLEVBQ0Y7QUFDRjtBQUdBLElBQU0sVUFBVTtBQUFBLEVBQ2QsTUFBTTtBQUFBLEVBQ04sWUFBWTtBQUFBLEVBQ1osZUFBZTtBQUFBLElBQ2IsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQUEsRUFDRCxpQkFBaUI7QUFBQSxJQUNmLFdBQVcsUUFBUSxJQUFJO0FBQUEsSUFDdkIsS0FBSztBQUFBLElBQ0wsU0FBUztBQUFBLEVBQ1gsQ0FBQztBQUNIO0FBQ0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLEVBRVA7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLElBRVA7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVxdWlyZSJdCn0K
