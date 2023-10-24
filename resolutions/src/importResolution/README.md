## @evmts/config/src/importResolution

Private internal code to handle import resolution

EVMts resolves the module graph itself before passing off the modules to solc. This is to keep the module resolution fully `hackable` internally.

Module resolution is done iteratively to avoid stack to deep errors

## [moduleFactory](./moduleFactory.js)
## [moduleFactorySync](./moduleFactorySync.js)

A moduleFactory takes props
- absolutePath - absolutePath of the solidity module
- rawCode - a string or buffer of the solidity source code
-	remappings - any import remappings
-	libs - any lib to resolve to (note node_module handled by default)

It then builds a recursive structure of modules to be used by the [compiler](../compiler/)

## [resolveImports](./resolveImports.js)

A simple function that resolves imports. It expects remappings to already be applied

## Warning about source maps

Because of the way we handle remappings and import resolutions the solc input doesn't match the source code. This needs to be taken into account if using solc for source maps like in [@evmts/ts-plugin](../../ts-plugin/)

This will get handled internally in future
