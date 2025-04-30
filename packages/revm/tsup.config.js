// Simple tsup configuration
export default {
  entryPoints: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  platform: 'browser',
  esbuildOptions(options) {
    options.external = ['../pkg/tevm_revm'];
  },
};