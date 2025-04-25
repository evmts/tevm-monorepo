// Browser worker implementation for WASI
const wasiWorker = new Worker(
  new URL('./tevm_bundler_rs.wasi-browser.js', import.meta.url),
  { type: 'module' },
)

export default wasiWorker