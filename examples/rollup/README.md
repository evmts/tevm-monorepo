# Tevm Rollup Example

This example demonstrates how to use Tevm with Rollup to import and interact with Solidity contracts directly in your browser application.

## Features

- Direct Solidity imports with full TypeScript support
- In-browser EVM execution
- Simple ERC-20 Token contract interaction example
- Rollup development server with live reloading

## Getting Started

### Prerequisites

- Node.js (>= 18)
- pnpm (>= 9)

### Installation

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

This will start a development server at http://localhost:8080 with live reloading enabled.

### Build

To create a production build:

```bash
pnpm build
```

To serve the production build:

```bash
pnpm start
```

## How It Works

This example uses the `@tevm/rollup-plugin` to enable direct Solidity imports in JavaScript files. The plugin:

1. Compiles Solidity contracts at build time
2. Generates TypeScript types for the contracts
3. Makes contract ABIs and bytecode available to the JavaScript code

In `main.js`, we import the Token contract directly from the Solidity file:

```javascript
import { Token } from '../contracts/Token.sol';
```

Then we can deploy and interact with the contract using the `@tevm/contract` package:

```javascript
const client = createMemoryClient();
const token = await client.deployContract(Token, ['Tevm Token', 'TEVM', 18, 1000000n]);
```

## Project Structure

- `contracts/` - Solidity smart contracts
- `src/` - JavaScript source code
- `public/` - Static assets and HTML
- `rollup.config.js` - Rollup configuration

## License

MIT