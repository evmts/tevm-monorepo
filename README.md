<a href="https://node.tevm.sh"><img src="https://github.com/user-attachments/assets/880d8f54-8063-4018-8777-98ba383433ee" width="400" alt="Tevm Logo" /></a>

<p align="center">
  A JavaScript-native Ethereum Virtual Machine
</p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
[![NPM Version](https://img.shields.io/npm/v/tevm)](https://www.npmjs.com/package/tevm)
[![Tevm Downloads](https://img.shields.io/npm/dm/tevm.svg)](https://www.npmjs.com/package/tevm)
[![Tevm Bundler Downloads](https://img.shields.io/npm/dm/@tevm/base-bundler.svg)](https://www.npmjs.com/package/@tevm/base-bundler)
[![Minzipped Size](https://badgen.net/bundlephobia/minzip/tevm)](https://bundlephobia.com/package/tevm@latest)

# Tevm Node

Tevm is a **complete Ethereum execution environment** implemented entirely in JavaScript that runs across any JS environment, including browsers, Node.js, Deno, and Bun. It provides the full functionality of an Ethereum node without requiring any blockchain client installation or native dependencies.

Conceptually, it works similarly to Anvil and Hardhat, but with more powerful TypeScript-native interoperability and cross-platform compatibility.

## ✨ Key Features

- **JavaScript-Native EVM** - Run an Ethereum environment anywhere JavaScript runs
- **Cross-Platform Compatibility** - The same code works in browsers, Node.js, Deno, and Bun
- **Zero Native Dependencies** - Pure JavaScript implementation with no compilation required
- **Network Forking** - Create local sandboxes of any EVM-compatible chain
- **Fine-grained EVM Control** - Access execution at any level of detail, from transactions to opcodes
- **Direct Solidity Imports** - Import `.sol` files directly into TypeScript with the bundler
- **Type-safe Interactions** - Full TypeScript support throughout the entire API surface

## 🚀 Getting Started

```bash
# Install Tevm in your project
npm install tevm viem@latest
```

Create your first Tevm client:

```typescript
// In-memory client (fastest, fully isolated)
import { createMemoryClient } from "tevm";
const client = createMemoryClient();

// OR: Fork client (use existing chain state)
import { createMemoryClient, http } from "tevm";
import { mainnet } from "tevm/chains";
const forkClient = createMemoryClient({
  fork: {
    transport: http("https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY"),
    common: mainnet,
  },
});
```

## 📋 Complete Example

```typescript
import { createMemoryClient, http, PREFUNDED_ACCOUNTS } from "tevm";
import { optimism } from "tevm/common";
import { parseAbi } from "viem";

// Create a client as a fork of Optimism mainnet
const client = createMemoryClient({
  common: optimism,
  fork: {
    transport: http("https://mainnet.optimism.io")
  },
});

// Wait for the fork to be ready
await client.tevmReady();

// Setup a test account with funds
const account = "0x" + "baD60A7".padStart(40, "0");
await client.setBalance({
  address: account,
  value: 10000000000000000000n // 10 ETH
});

// Define contract interface
const greeterAbi = parseAbi([
  'function greet() view returns (string)',
  'function setGreeting(string memory _greeting) public'
]);
const greeterAddress = "0x10ed0b176048c34d69ffc0712de06CbE95730748";

// Read from contract
const greeting = await client.readContract({
  address: greeterAddress,
  abi: greeterAbi,
  functionName: 'greet',
});
console.log(`Current greeting: ${greeting}`);

// Write to contract
const txHash = await client.writeContract({
  account,
  address: greeterAddress,
  abi: greeterAbi,
  functionName: 'setGreeting',
  args: ["Hello from Tevm!"],
});

// Mine a block to include our transaction
await client.mine({ blocks: 1 });

// Verify the updated greeting
const newGreeting = await client.readContract({
  address: greeterAddress,
  abi: greeterAbi,
  functionName: 'greet',
});
console.log(`Updated greeting: ${newGreeting}`);
```

## 🔄 Import Solidity Contracts Directly

One of Tevm's most powerful features is the ability to import Solidity files directly into your TypeScript code using the Tevm Bundler:

```typescript
// Import a .sol file directly 
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { createMemoryClient } from 'tevm';

const client = createMemoryClient();

// With full TypeScript support
const tokenContract = ERC20.withAddress('0x123...');

// Type-safe contract methods
const balance = await client.readContract(
  tokenContract.read.balanceOf('0x456...')
);
```

[See the Bundler Quickstart guide](https://node.tevm.sh/getting-started/bundler) for setup instructions.

## 🧪 Why Run Ethereum in JavaScript?

- **Performance**: Eliminate network latency with local execution
- **Enhanced UX**: Enable offline capabilities, optimistic UI updates, and sophisticated simulations
- **Developer Experience**: Advanced debugging, deterministic testing, and portable environments
- **Ecosystem Integration**: Leverage the entire JavaScript ecosystem and tooling

## 🔧 Advanced Features

### EVM Execution Hooks

```typescript
await client.tevmContract({
  address: contractAddress,
  abi: contractAbi,
  functionName: 'transfer',
  args: ['0x...', 100n],
  // Step through execution
  onStep: (data, next) => {
    console.log(`Opcode: ${data.opcode.name}`);
    console.log(`Stack: ${data.stack.join(', ')}`);
    next();
  }
});
```

### Chain Forking

```typescript
import { createMemoryClient, http } from 'tevm';
import { optimism } from 'tevm/chains';

// Fork from Optimism mainnet
const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    common: optimism
  }
});

// Access any contract or account state from the forked network
const balance = await client.getBalance({ 
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // vitalik.eth
});
```

### Flexible Mining Control

```typescript
// Manual mining (default)
await client.sendTransaction({ /* ... */ });
await client.mine({ blocks: 1 }); // Explicitly mine when ready

// Auto-mining
client.setMining({ mode: 'auto' }); // Mine on each transaction

// Interval mining
client.setMining({ 
  mode: 'interval',
  interval: 5000 // Mine every 5 seconds
});
```

## 📚 Documentation

For comprehensive documentation, visit [node.tevm.sh](https://node.tevm.sh) for:

- [Getting Started Guide](https://node.tevm.sh/getting-started/overview)
- [Viem Integration](https://node.tevm.sh/getting-started/viem)
- [Ethers Integration](https://node.tevm.sh/getting-started/ethers)
- [Bundler Quickstart](https://node.tevm.sh/getting-started/bundler)
- [API Reference](https://node.tevm.sh/api)
- [Examples and Tutorials](https://node.tevm.sh/examples)

## 👥 Community

- [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)
- [GitHub Discussions](https://github.com/evmts/tevm-monorepo/discussions)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute.

## 📄 License

Most files are licensed under the [MIT license](./LICENSE). Some files copied from ethereumjs inherit the [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2) license. These files are individually marked at the top.

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
