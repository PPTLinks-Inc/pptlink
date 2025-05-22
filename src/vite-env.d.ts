/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_FLW_PUBLIC_KEY: string
  readonly VITE_CONVEX_URL: string
  readonly VITE_S3_ORIGIN: string
  readonly VITE_CLOUDFONT_ORIGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}