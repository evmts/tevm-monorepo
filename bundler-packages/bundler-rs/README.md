# @tevm/bundler-rs

A high-performance Rust implementation of the Tevm bundler for Solidity contracts.

## Overview

The bundler-rs package is a complete rewrite of Tevm's bundler functionality in Rust, combining the features of the existing `compiler` and `base-bundler` packages into a single, more efficient implementation. It uses the Rust implementations of:

- `resolutions-rs` - For resolving Solidity imports
- `solc-rs` - For compiling Solidity code
- `runtime-rs` - For generating JavaScript/TypeScript runtime code

This package provides significant performance improvements over the JavaScript implementation while maintaining API compatibility.

## Features

- **Direct import** - Import Solidity contracts directly in JavaScript/TypeScript
- **TypeScript support** - Full TypeScript type safety for Solidity contracts
- **Multiple formats** - Generate TypeScript, CommonJS, ESM, or declaration files
- **Full compilation** - Access to all solc compiler options and outputs
- **Caching** - Efficient caching system for faster builds
- **Async-only API** - Simplified, consistent async-only API

## Installation

```bash
npm install @tevm/bundler-rs
# or
yarn add @tevm/bundler-rs
# or
pnpm add @tevm/bundler-rs
```

## Usage

```js
import { createBundler } from '@tevm/bundler-rs';

// Create file access object
const fileAccess = {
  readFile: async (path) => fs.promises.readFile(path, 'utf8'),
  writeFile: async (path, content) => fs.promises.writeFile(path, content),
  exists: async (path) => fs.promises.access(path).then(() => true).catch(() => false)
};

// Create bundler
const bundler = await createBundler({
  remappings: [
    ['@openzeppelin/', './node_modules/@openzeppelin/']
  ],
  libs: ['./node_modules'],
  solcVersion: '0.8.20',
  cacheDir: './.tevm-cache',
  debug: false
}, fileAccess);

// Compile a Solidity file to TypeScript
const result = await bundler.resolveTsModule(
  './contracts/MyContract.sol',
  process.cwd(),
  {
    optimize: true,
    optimizerRuns: 200,
    includeAst: false,
    includeBytecode: true
  }
);

// Write the result to a file
await fs.promises.writeFile('./dist/MyContract.ts', result.code);
```

## API Reference

### `createBundler(config, fileAccess)`

Creates a new bundler instance.

- **config**: Configuration options for the bundler
  - `remappings`: Array of [from, to] pairs for Solidity import remappings
  - `libs`: Array of library paths to search for imports
  - `solcPath`: Optional path to solc binary
  - `solcVersion`: Solidity compiler version to use
  - `cacheDir`: Directory for caching compilation results
  - `useCache`: Whether to use caching (default: true)
  - `debug`: Enable debug logging (default: false)
  - `contractPackage`: Package name for imports in generated code (default: '@tevm/contract')

- **fileAccess**: File system access object
  - `readFile`: Function to read a file (async)
  - `writeFile`: Function to write a file (async)
  - `exists`: Function to check if a file exists (async)

### Bundler Methods

All methods are async-only:

- **`resolveTsModule(filePath, baseDir, solcOptions)`**: Compile to TypeScript (.ts)
- **`resolveEsmModule(filePath, baseDir, solcOptions)`**: Compile to ES Modules (.mjs)
- **`resolveCjsModule(filePath, baseDir, solcOptions)`**: Compile to CommonJS (.cjs)
- **`resolveDts(filePath, baseDir, solcOptions)`**: Compile to TypeScript declarations (.d.ts)
- **`compileArtifacts(filePath, baseDir, solcOptions)`**: Compile to raw artifacts

### Solidity Compiler Options

- **`optimize`**: Enable optimization (default: true)
- **`optimizerRuns`**: Number of optimization runs (default: 200)
- **`evmVersion`**: EVM version to target
- **`includeAst`**: Include AST in output (default: false)
- **`includeBytecode`**: Include bytecode in output (default: true)
- **`includeSourceMap`**: Include source map in output (default: false)
- **`includeUserDocs`**: Include user documentation (default: true)
- **`includeDevDocs`**: Include developer documentation (default: false)

## Development

### Building

```bash
# Debug build
npm run build:debug

# Release build
npm run build:release

# All platforms
npm run build
```

### Testing

```bash
npm test
```

### Running examples

```bash
npm run example
```

## License

MIT