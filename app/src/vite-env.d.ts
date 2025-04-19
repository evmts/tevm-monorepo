/// <reference types="svelte" />
/// <reference types="vite/client" />

// Add interface declarations for global variables provided by Vite here.
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
