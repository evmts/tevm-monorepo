---
"@evmts/bundler": minor
"@evmts/esbuild-plugin": minor
"@evmts/webpack-plugin": minor
"@evmts/rollup-plugin": minor
"@evmts/rspack-plugin": minor
"@evmts/vite-plugin": minor
---

Added bundler option for tsconfigPath

For all bundlers now passing in a relative path to the tsconfig will use the specified tsconfig instead of the default of `./tsconfig.json`

