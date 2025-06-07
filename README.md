<a href="https://node.tevm.sh">
  <img src="https://github.com/user-attachments/assets/880d8f54-8063-4018-8777-98ba383433ee" width="400" alt="Tevm Logo" />
</a>

<p align="center">
  <b>A JavaScript-Native Ethereum Virtual Machine</b>
</p>

<p align="center">
  <a href="https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml">
    <img src="https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://www.npmjs.com/package/tevm">
    <img src="https://img.shields.io/npm/v/tevm" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/tevm">
    <img src="https://img.shields.io/npm/dm/tevm.svg" alt="Tevm Downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@tevm/base-bundler">
    <img src="https://img.shields.io/npm/dm/@tevm/base-bundler.svg" alt="Tevm Bundler Downloads" />
  </a>
  <a href="https://bundlephobia.com/package/tevm@latest">
    <img src="https://badgen.net/bundlephobia/minzip/tevm" alt="Minzipped Size" />
  </a>
</p>

---

# Tevm Node

**Tevm** is a complete Ethereum execution environment, implemented entirely in JavaScript. It runs seamlessly across all JavaScript environments—Node.js, browsers, Deno, and Bun—delivering the full power of an Ethereum node with zero native dependencies.

Think of Tevm as your JavaScript-native alternative to Anvil or Hardhat, but with even deeper TypeScript integration, cross-platform flexibility, and a modern developer experience.

---

## ✨ Features at a Glance

- **JavaScript-Native EVM**: Run Ethereum anywhere JavaScript runs.
- **Universal Compatibility**: Works in Node.js, browsers, Deno, and Bun.
- **Zero Native Dependencies**: 100% JavaScript—no compilation, no headaches.
- **Network Forking**: Instantly sandbox any EVM-compatible chain.
- **Granular EVM Control**: Inspect and manipulate execution at any level.
- **Direct Solidity Imports**: Import `.sol` files straight into TypeScript.
- **Type-Safe Interactions**: End-to-end TypeScript support.

---

## 🚀 Quick Start

Install Tevm and Viem:

```bash
npm install tevm viem@latest
```

Create your first Tevm client:

```typescript
// In-memory client (fast, fully isolated)
import { createMemoryClient } from "tevm";
const client = createMemoryClient();

// Or: Fork an existing chain
import { createMemoryClient, http } from "tevm";
import { mainnet } from "tevm/chains";
const forkClient = createMemoryClient({
  fork: {
    transport: http("https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY"),
    common: mainnet,
  },
});
```

---

## 📋 Complete Example

```typescript
import { createMemoryClient, http, PREFUNDED_ACCOUNTS } from "tevm";
import { optimism } from "tevm/common";
import { parseAbi } from "viem";

// Fork Optimism mainnet
const client = createMemoryClient({
  common: optimism,
  fork: {
    transport: http("https://mainnet.optimism.io"),
  },
});

await client.tevmReady();

// Fund a test account
const account = "0x" + "baD60A7".padStart(40, "0");
await client.setBalance({
  address: account,
  value: 10_000_000_000_000_000_000n, // 10 ETH
});

// Define contract ABI
const greeterAbi = parseAbi([
  "function greet() view returns (string)",
  "function setGreeting(string memory _greeting) public",
]);
const greeterAddress = "0x10ed0b176048c34d69ffc0712de06CbE95730748";

// Read from contract
const greeting = await client.readContract({
  address: greeterAddress,
  abi: greeterAbi,
  functionName: "greet",
});
console.log(`Current greeting: ${greeting}`);

// Write to contract
const txHash = await client.writeContract({
  account,
  address: greeterAddress,
  abi: greeterAbi,
  functionName: "setGreeting",
  args: ["Hello from Tevm!"],
});

// Mine a block to include the transaction
await client.mine({ blocks: 1 });

// Verify the update
const newGreeting = await client.readContract({
  address: greeterAddress,
  abi: greeterAbi,
  functionName: "greet",
});
console.log(`Updated greeting: ${newGreeting}`);
```

---

## 🔄 Import Solidity Contracts Directly

Tevm’s bundler lets you import Solidity contracts straight into TypeScript, with full type safety:

```typescript
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { createMemoryClient } from "tevm";

const client = createMemoryClient();

const tokenContract = ERC20.withAddress("0x123...");

// Type-safe contract methods
const balance = await client.readContract(
  tokenContract.read.balanceOf("0x456..."),
);
```

> See the [Bundler Quickstart guide](https://node.tevm.sh/getting-started/bundler) for setup.

---

## 🧪 Why Run Ethereum in JavaScript?

- **Performance**: Eliminate network latency with local execution.
- **Enhanced UX**: Enable offline dApps, optimistic UI, and advanced simulations.
- **Developer Experience**: Debug, test, and prototype with deterministic, portable environments.
- **Ecosystem Integration**: Leverage the full power of the JavaScript ecosystem.

---

## 🔧 Advanced Features

### EVM Execution Hooks

Step through EVM execution at the opcode level:

```typescript
await client.tevmContract({
  address: contractAddress,
  abi: contractAbi,
  functionName: "transfer",
  args: ["0x...", 100n],
  onStep: (data, next) => {
    console.log(`Opcode: ${data.opcode.name}`);
    console.log(`Stack: ${data.stack.join(", ")}`);
    next();
  },
});
```

### Chain Forking

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/chains";

const client = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io"),
    common: optimism,
  },
});

// Access any contract or account state from the forked network
const balance = await client.getBalance({
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth
});
```

### Flexible Mining Control

```typescript
// Manual mining (default)
await client.sendTransaction({
  /* ... */
});
await client.mine({ blocks: 1 });

// Auto-mining
client.setMining({ mode: "auto" });

// Interval mining
client.setMining({
  mode: "interval",
  interval: 5000, // Mine every 5 seconds
});
```

---

## 📚 Documentation

Explore the full documentation at [node.tevm.sh](https://node.tevm.sh):

- [Getting Started Guide](https://node.tevm.sh/getting-started/overview)
- [Viem Integration](https://node.tevm.sh/getting-started/viem)
- [Ethers Integration](https://node.tevm.sh/getting-started/ethers)
- [Bundler Quickstart](https://node.tevm.sh/getting-started/bundler)
- [API Reference](https://node.tevm.sh/api)
- [Examples and Tutorials](https://node.tevm.sh/examples)

---

## 👥 Community

- [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)
- [GitHub Discussions](https://github.com/evmts/tevm-monorepo/discussions)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

Most files are licensed under [MIT](./LICENSE). Some files, copied from ethereumjs, are under [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2) and are marked accordingly.

<a href="./LICENSE">
  <img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" />
</a>
