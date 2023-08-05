---
"@evmts/esbuild-plugin": patch
---

Added unit test to @evmts/esbuild-plugin

@evmts/esbuild-plugin is simply reexporting [unplugin](https://github.com/unjs/unplugin) so the unit test coverage is minimal. It does provide useful documentation for the shape of the esbuild plugin however and a record of if it has changed

Further testing planned via e2e playwright tests of the esbuild viem example in upcoming release
