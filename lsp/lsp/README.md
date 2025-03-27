# Tevm Language Server

A Volar-powered language server implementation for Tevm, providing TypeScript integration for Solidity contracts.

## Features

- **Import Solidity contracts directly in TypeScript/JavaScript**
  - Get full TypeScript type checking for imported `.sol` files
  - Automatic compilation and type generation

- **Go-to-definition support**
  - Navigate directly to Solidity functions and events
  - Seamless integration with TypeScript code navigation

- **Embedded Solidity support via `sol` tag**
  - Write Solidity code in TypeScript/JavaScript template literals
  - Get syntax highlighting and TypeScript checking for embedded Solidity

## Installation

```bash
npm install @tevm/lsp
```

## Usage

### VS Code Extension

The easiest way to use the language server is through the VS Code extension:

1. Install the Tevm VS Code extension
2. Open a TypeScript/JavaScript project that uses Tevm
3. Import Solidity files directly:

```typescript
import { Counter } from './Counter.sol';

// Full TypeScript type checking for Solidity contracts
const counter = new Counter();
const count = await counter.read.count();
```

### CLI Usage

You can also run the language server directly:

```bash
npx tevm-lsp
```

### Programmatic Usage

```typescript
import { createLanguageServer } from '@tevm/lsp';

// Create and start the language server
createLanguageServer();
```

## Configuration

The language server can be configured through a `tevm.config.json` file in your project root:

```json
{
  "solcVersion": "0.8.28",
  "cacheDir": ".tevm",
  "debug": false
}
```

## Development

### Building

```bash
pnpm build
```

### Running Tests

```bash
pnpm test
```

## License

MIT