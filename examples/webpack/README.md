# Tevm Webpack Example

This example demonstrates how to use Tevm with Webpack to import and interact with Solidity contracts directly in your browser application.

## Features

- Direct Solidity imports with full TypeScript support
- In-browser EVM execution
- Simple Counter contract interaction example
- Webpack development server with hot reloading

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

This will start a development server at http://localhost:9000 with hot reloading enabled.

### Build

To create a production build:

```bash
pnpm build
```

The build output will be in the `dist` directory.

## How It Works

This example uses the `@tevm/webpack-plugin` to enable direct Solidity imports in JavaScript files. The plugin:

1. Compiles Solidity contracts at build time
2. Generates TypeScript types for the contracts
3. Makes contract ABIs and bytecode available to the JavaScript code

In `index.js`, we import the Counter contract directly from the Solidity file:

```javascript
import { Counter } from '../contracts/Counter.sol';
```

Then we can deploy and interact with the contract using the `@tevm/contract` package:

```javascript
const client = createMemoryClient();
const contract = await client.deployContract(Counter, [10n]);
```

## Project Structure

- `contracts/` - Solidity smart contracts
- `src/` - JavaScript source code
- `webpack.config.js` - Webpack configuration

## License

MIT