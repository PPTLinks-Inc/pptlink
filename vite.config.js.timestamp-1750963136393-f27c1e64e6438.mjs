// vite.config.js
import react from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/tailwindcss/lib/index.js";
import path from "node:path";
import { normalizePath, defineConfig } from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/vite-plugin-static-copy/dist/index.js";
import { createRequire } from "node:module";
import basicSsl from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
import { sentryVitePlugin } from "file:///C:/Users/RAYMOND/Desktop/pptlink/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\RAYMOND\\Desktop\\pptlink";
var __vite_injected_original_import_meta_url = "file:///C:/Users/RAYMOND/Desktop/pptlink/vite.config.js";
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
  // basicSsl()
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSQVlNT05EXFxcXERlc2t0b3BcXFxccHB0bGlua1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUkFZTU9ORFxcXFxEZXNrdG9wXFxcXHBwdGxpbmtcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1JBWU1PTkQvRGVza3RvcC9wcHRsaW5rL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcInRhaWx3aW5kY3NzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgbm9ybWFsaXplUGF0aCwgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIjtcclxuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gXCJub2RlOm1vZHVsZVwiO1xyXG5pbXBvcnQgYmFzaWNTc2wgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWJhc2ljLXNzbFwiO1xyXG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSBcIkBzZW50cnkvdml0ZS1wbHVnaW5cIjtcclxuXHJcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XHJcbmNvbnN0IGNNYXBzRGlyID0gbm9ybWFsaXplUGF0aChcclxuICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHJlcXVpcmUucmVzb2x2ZShcInBkZmpzLWRpc3QvcGFja2FnZS5qc29uXCIpKSwgXCJjbWFwc1wiKVxyXG4pO1xyXG5jb25zdCBzdGFuZGFyZEZvbnRzRGlyID0gbm9ybWFsaXplUGF0aChcclxuICBwYXRoLmpvaW4oXHJcbiAgICBwYXRoLmRpcm5hbWUocmVxdWlyZS5yZXNvbHZlKFwicGRmanMtZGlzdC9wYWNrYWdlLmpzb25cIikpLFxyXG4gICAgXCJzdGFuZGFyZF9mb250c1wiXHJcbiAgKVxyXG4pO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuY29uc3QgcGx1Z2lucyA9IFtcclxuICByZWFjdCgpLFxyXG4gIHRhaWx3aW5kY3NzKCksXHJcbiAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgdGFyZ2V0czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBjTWFwc0RpcixcclxuICAgICAgICBkZXN0OiBcIlwiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IHN0YW5kYXJkRm9udHNEaXIsXHJcbiAgICAgICAgZGVzdDogXCJcIlxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfSksXHJcbiAgc2VudHJ5Vml0ZVBsdWdpbih7XHJcbiAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxyXG4gICAgb3JnOiBcInBwdGxpbmtzXCIsXHJcbiAgICBwcm9qZWN0OiBcInBwdGxpbmtzLWZyb250ZW5kXCIsXHJcbiAgfSlcclxuICAvLyBiYXNpY1NzbCgpXHJcbl07XHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogcGx1Z2lucyxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIHNvdXJjZW1hcDogdHJ1ZVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBhZGQgcHJveHkgZm9yIGFwaSBsYXRlclxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFIsT0FBTyxXQUFXO0FBQzlTLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGVBQWUsb0JBQW9CO0FBQzVDLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sY0FBYztBQUNyQixTQUFTLHdCQUF3QjtBQVBqQyxJQUFNLG1DQUFtQztBQUF3SSxJQUFNLDJDQUEyQztBQVNsTyxJQUFNQSxXQUFVLGNBQWMsd0NBQWU7QUFDN0MsSUFBTSxXQUFXO0FBQUEsRUFDZixLQUFLLEtBQUssS0FBSyxRQUFRQSxTQUFRLFFBQVEseUJBQXlCLENBQUMsR0FBRyxPQUFPO0FBQzdFO0FBQ0EsSUFBTSxtQkFBbUI7QUFBQSxFQUN2QixLQUFLO0FBQUEsSUFDSCxLQUFLLFFBQVFBLFNBQVEsUUFBUSx5QkFBeUIsQ0FBQztBQUFBLElBQ3ZEO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTSxVQUFVO0FBQUEsRUFDZCxNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixlQUFlO0FBQUEsSUFDYixTQUFTO0FBQUEsTUFDUDtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFBQSxFQUNELGlCQUFpQjtBQUFBLElBQ2YsV0FBVyxRQUFRLElBQUk7QUFBQSxJQUN2QixLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsRUFDWCxDQUFDO0FBQUE7QUFFSDtBQUNBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxFQUVQO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxJQUVQO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInJlcXVpcmUiXQp9Cg==
