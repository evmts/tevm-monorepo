import { createTsupOptions } from '@tevm/tsupconfig';

export default createTsupOptions({
  entry: ['src/index.ts'],
  browser: true,
  // Allow importing of wasm files
  external: ['../pkg/revm_wasm'],
  copyFiles: [
    { from: 'target/wasm32-wasi/release/*.wasm', to: 'dist/' }
  ],
});