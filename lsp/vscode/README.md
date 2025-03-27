# Tevm VS Code Extension

VS Code extension for Tevm language features, providing seamless TypeScript integration for Solidity contracts.

## Features

- **Direct Solidity imports in TypeScript/JavaScript**
  - Import `.sol` files directly in your code
  - Full TypeScript typings for Solidity contracts
  - Automatic compilation and type generation

- **Go-to-definition support**
  - Navigate from TypeScript/JavaScript to Solidity code
  - Jump directly to function and event implementations
  - Seamless integration with standard code navigation

- **Embedded Solidity via `sol` template tag**
  - Write Solidity code in template literals with `sol` tag
  - Get syntax highlighting and language features
  - Errors and warnings directly in your editor

- **Syntax highlighting for Solidity files**
  - Full syntax highlighting for `.sol` files
  - Semantic token support

## Usage

### Importing Solidity Files

```typescript
// Import a Solidity contract directly
import { Counter } from './Counter.sol';

// Use with full TypeScript type checking
const counter = new Counter();
const count = await counter.read.count();
```

### Using the `sol` Template Tag

```typescript
import { sol } from 'tevm';

// Write Solidity code directly in template literals
const counterContract = sol`
  // This is Solidity code with full language support
  contract Counter {
    uint256 public count;
    
    function increment() public {
      count += 1;
    }
    
    function reset() public {
      count = 0;
    }
  }
`;
```

## Requirements

- VS Code 1.82.0 or higher
- Node.js 16 or higher

## Extension Settings

This extension contributes the following settings:

* `tevm.solcVersion`: Solidity compiler version to use
* `tevm.debug`: Enable debug mode for verbose logging

## Troubleshooting

If you encounter issues:

1. Ensure your project has a `tevm.config.json` configuration file
2. Check the Output panel for "Tevm Language Server" logs
3. Restart VS Code if language features aren't working

## License

MIT