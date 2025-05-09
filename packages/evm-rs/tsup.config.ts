import { createTsupOptions } from '../../configs/tsupconfig'
import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return createTsupOptions({
    // Only build the JS wrapper, the WASM will be built separately
    entry: ['src/index.js'],
    // Generate .d.ts files
    dts: true,
    // Include the wasm loader in external
    external: ['../pkg/evm_rs.js'],
    ...options,
  })
})