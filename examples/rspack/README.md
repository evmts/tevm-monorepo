# Tevm Rspack Example

This example demonstrates how to use Tevm with Rspack to import and interact with Solidity contracts directly in your browser application.

## Features

- Direct Solidity imports with full TypeScript support
- In-browser EVM execution
- NFT (ERC-721) contract interaction example
- Rspack development server with hot reloading

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

This will start a development server at http://localhost:8090 with hot reloading enabled.

### Build

To create a production build:

```bash
pnpm build
```

The build output will be in the `dist` directory.

## How It Works

This example uses the `@tevm/rspack-plugin` to enable direct Solidity imports in JavaScript files. The plugin:

1. Compiles Solidity contracts at build time
2. Generates TypeScript types for the contracts
3. Makes contract ABIs and bytecode available to the JavaScript code

In `index.js`, we import the NFT contract directly from the Solidity file:

```javascript
import { NFT } from '../contracts/NFT.sol';
```

Then we can deploy and interact with the contract using the `@tevm/contract` package:

```javascript
const client = createMemoryClient();
const nftContract = await client.deployContract(NFT, ['Tevm NFT Collection', 'TEVM']);
```

## Project Structure

- `contracts/` - Solidity smart contracts
- `src/` - JavaScript source code
- `public/` - Static assets and HTML
- `rspack.config.js` - Rspack configuration

## About Rspack

[Rspack](https://www.rspack.dev/) is a Rust-based JavaScript bundler that aims to be a faster alternative to Webpack. It maintains a high degree of compatibility with the Webpack API, making it easy to migrate from Webpack to Rspack.

## License

MIT