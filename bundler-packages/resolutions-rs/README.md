# @tevm/resolutions-rs

A high-performance Rust implementation of Solidity import resolution for Tevm, with JavaScript bindings using NAPI-RS.

## Features

- Fast Solidity import resolution powered by Rust
- Support for import remappings
- Support for library paths
- Cross-platform binaries
- Fully compatible with the JavaScript `@tevm/resolutions` API

## Installation

```bash
npm install @tevm/resolutions-rs
# or
yarn add @tevm/resolutions-rs
# or
pnpm add @tevm/resolutions-rs
```

## Usage

```js
import { resolveImports, processModule } from '@tevm/resolutions-rs';

// Resolve imports in a Solidity file
const code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Dependency.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test {
    // Contract code
}
`;

const filePath = '/path/to/Contract.sol';

// Define remappings (similar to Solidity remappings)
const remappings = {
  '@openzeppelin/': '/path/to/node_modules/@openzeppelin/',
};

// Define library paths
const libs = [
  '/path/to/lib',
];

// Resolve imports
const imports = await resolveImports(filePath, code, remappings, libs);
console.log(imports);
/*
[
  {
    original: './Dependency.sol',
    absolute: '/path/to/Dependency.sol',
    updated: '/path/to/Dependency.sol'
  },
  {
    original: '@openzeppelin/contracts/token/ERC20/IERC20.sol',
    absolute: '/path/to/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol',
    updated: '/path/to/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol'
  }
]
*/

// Process a module (resolve imports and transform code)
const moduleInfo = await processModule(filePath, code, remappings, libs);
console.log(moduleInfo);
/*
{
  code: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n...',
  imported_ids: [
    '/path/to/Dependency.sol',
    '/path/to/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol'
  ]
}
*/
```

## API

### resolveImports(filePath, code, remappings?, libs?)

Resolves all import paths found in the given Solidity code.

- **filePath** `string` - The absolute path of the file containing the imports
- **code** `string` - The source code to scan for imports
- **remappings** `Record<string, string>` (optional) - Map of import path prefixes to replacement values
- **libs** `string[]` (optional) - Additional library paths to search for imports
- **Returns** `Promise<ResolvedImport[]>` - A promise that resolves to an array of resolved imports

### processModule(filePath, code, remappings?, libs?)

Process a module to extract its imports and transform the code as needed.

- **filePath** `string` - The absolute path of the file
- **code** `string` - The source code to process
- **remappings** `Record<string, string>` (optional) - Map of import path prefixes to replacement values
- **libs** `string[]` (optional) - Additional library paths to search for imports
- **Returns** `Promise<ModuleInfo>` - A promise that resolves to a ModuleInfo object

## Types

### ResolvedImport

```typescript
interface ResolvedImport {
  // The original import path as it appears in the source code
  original: string
  // The absolute file system path to the imported module
  absolute: string
  // The updated import path (may be different from original if remappings were applied)
  updated: string
}
```

### ModuleInfo

```typescript
interface ModuleInfo {
  // The code content after transforming to correctly resolve remappings
  code: string
  // List of absolute file paths to modules that are statically imported by this module
  imported_ids: string[]
}
```

## Building from Source

If you want to build the package from source, you'll need:

1. Rust toolchain (install with [rustup](https://rustup.rs/))
2. Node.js (v14 or later)
3. [NAPI-RS CLI](https://napi.rs/docs/introduction/getting-started)

```bash
# Install NAPI-RS CLI
npm install -g @napi-rs/cli

# Clone the repository
git clone https://github.com/evmts/tevm-monorepo.git
cd tevm-monorepo/bundler-packages/resolutions-rs

# Build the package
npm run build
```

## License

MIT