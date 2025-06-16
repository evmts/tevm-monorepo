<p align="center">
  <a href="https://node.tevm.sh">
    <img src="https://github.com/user-attachments/assets/880d8f54-8063-4018-8777-98ba383433ee" width="400" alt="Tevm Logo" />
  </a>
</p>

<h1 align="center">Tevm</h1>

<p align="center">
  <b>JavaScript-Native Ethereum Virtual Machine</b>
</p>

<p align="center">
  <a href="https://github.com/evmts/tevm-monorepo/actions/workflows/ci.yml">
    <img src="https://github.com/evmts/tevm-monorepo/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://www.npmjs.com/package/tevm">
    <img src="https://img.shields.io/npm/v/tevm" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/tevm">
    <img src="https://img.shields.io/npm/dm/tevm.svg" alt="Tevm Downloads" />
  </a>
  <a href="https://bundlephobia.com/package/tevm@latest">
    <img src="https://badgen.net/bundlephobia/minzip/tevm" alt="Minzipped Size" />
  </a>
  <a href="https://t.me/+ANThR9bHDLAwMjUx">
    <img alt="Telegram" src="https://img.shields.io/badge/chat-telegram-blue.svg">
  </a>
  <a href="https://deepwiki.com/evmts/tevm-monorepo">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki">
  </a>
</p>

---

## 🚀 The EVM for TypeScript, JavaScript, and the Modern Web

Tevm puts an Ethereum node anywhere JavaScript runs—Node, browser, serverless, edge, or desktop. Instantly fork mainnet, simulate complex contracts, and run full-stack devnets, all with TypeScript-first safety and blazing speed.

If you use **viem**, **wagmi**, **0x**, or build modern Ethereum apps, Tevm is the engine that powers next-level shipping, testing, and UX.

---

## ✨ Why Tevm?

- **⚡ Ship at Lightspeed**: Instant feedback. Test and deploy with no wait, no Docker, no slow subprocesses. Build and iterate like the Rust and Go elite—now in JS and Zig.
- **🚫 Goodbye, Loading Spinners**: Deliver real optimistic UI. Run every contract locally for true instant dapp experiences—no more waiting on RPCs.
- **🔒 TypeScript-Native Confidence**: End-to-end type safety and autocompletion. Import Solidity, call contracts, and simulate transactions with zero guesswork.
- **🌐 Mainnet-Grade Simulation**: Fork any EVM chain—mainnet, L2, L3—and manipulate state locally with full fidelity.
- **🧪 Unmatched Testing Power**: Write robust integration tests, simulate reorgs, verify gas, and check UX edge cases, all in one toolkit.
- **💻 True Local-First**: Full EVM in Node, browser, or edge—offline or online, always in your control.
- **🎯 The Fastest Path from Idea to User**: Tevm Compiler brings Solidity into your codebase with real types, letting you ship faster and safer than ever before.
- **⚡ Optimistic Updates, Advanced Gas Modeling**: Build dapps that feel like Web2 and simulate costs with precision, in JS/TS.

---

## 🛠️ The Tevm Ecosystem

Everything you need to build, simulate, and ship at the speed of your ideas.

### 1. Tevm Node: Instant, In-Memory Ethereum

Run an EVM devnet anywhere—Node, browser, edge, or serverless. One line, zero dependencies.

```typescript
import { createMemoryClient } from "tevm";
const client = createMemoryClient();
```

### 2. Tevm Bundler: Solidity—Typed, Bundled, Native

Import Solidity right into TypeScript and call it with full type safety:

```typescript
import { ERC20 } from '@openzeppelin/contracts/token/ERC20.sol';
import { createMemoryClient } from 'tevm';
const client = createMemoryClient();

const token = ERC20.withAddress("0x123...");
const balance = await client.readContract(token.read.balanceOf("0x456..."));
```

Write contracts inline with `sol` template literals (coming soon):

```typescript
import { sol } from 'tevm';
const { MyContract } = sol`
  contract MyContract {
    function greet() public pure returns (string memory) {
      return "hello";
    }
  }
`;
```

[See Bundler Quickstart →](https://node.tevm.sh/getting-started/bundler)

### 3. ZigEvm (WIP): The Smallest, Fastest Wasm EVM

A new EVM core in Zig for true browser and edge-native execution—under 100kb, launching soon. [Source](https://github.com/evmts/tevm-monorepo/tree/main/src)

### 4. Tevm Engine (Preview): Optimistic UX for viem/wagmi

Next-gen plugin for instant optimistic updates, auto-caching, and devnet magic in your frontend.

---

## 💡 What Can You Do With Tevm?

- **🔄 Test Against Mainnet or Any Chain**: Fork and simulate mainnet, L2s, L3s, and custom rollups with a single call.
- **🤖 Prototype Next-Gen Apps**: From L2 fraud proofs to LLM/EVM wallets and AI agents—in the browser or edge.
- **✨ Deliver Seamless UX**: Eliminate spinners. Build apps that always feel instant.
- **⛽ Model Gas & Simulate Fees**: Run "what if" gas scenarios and advanced fee logic, locally and reproducibly.
- **🔍 Debug, Profile, and Introspect**: Step through opcodes and inspect contract state in real time.

---

## 📊 Devnet Comparison

| Feature | Tevm | Anvil | Hardhat | Ganache | Tenderly |
|---------|------|-------|---------|---------|----------|
| **Language** | JS/Wasm (Zig WIP) | Rust | JS/Rust | JS | Go |
| **Browser Support** | ✅ | ❌ | ❌ | ❌ | ✅ (SaaS) |
| **Minimal Dependencies** | ✅ | ✅ | ❌ | ❌ | ✅ (SaaS) |
| **Viem Integration** | Native | Yes (RPC) | Minimal | Minimal | None |
| **Forking (L1, Rollups)** | ✅ | ✅ | ✅ | Some | ✅ |
| **Rebase/Fork Updates** | Soon | ❌ | ❌ | ❌ | ✅ |
| **Solidity Tests** | Some | Yes | Yes | No | No |
| **Fuzzing** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Open Source** | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 🏆 Backed by the Ethereum Foundation

Tevm is funded by an Ethereum Foundation grant. Our roadmap:

- ✅ **Tevm 1.0.0 Release**
- 🔄 **Test Library**
- 🎮 **MUD Integration** for onchain games
- 🚀 **ZigEvm Launch**: Fastest Wasm EVM ever

---

## ⚡ Quick Start

```bash
npm install tevm viem@latest
```

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/chains";
import { parseAbi } from "viem";

// Fork Optimism mainnet
const client = createMemoryClient({
  common: optimism,
  fork: { transport: http("https://mainnet.optimism.io") },
});
await client.tevmReady();

const account = "0x" + "baD60A7".padStart(40, "0");
await client.setBalance({ address: account, value: 10_000_000_000_000_000_000n });

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

// Write to contract
await client.writeContract({
  account,
  address: greeterAddress,
  abi: greeterAbi,
  functionName: "setGreeting",
  args: ["Hello from Tevm!"],
});

await client.mine({ blocks: 1 });

const newGreeting = await client.readContract({
  address: greeterAddress,
  abi: greeterAbi,
  functionName: "greet",
});
```

---

## 📚 Learn More

- 📖 [Getting Started](https://node.tevm.sh/getting-started/overview)
- 🔗 [Viem Integration](https://node.tevm.sh/getting-started/viem)
- 📦 [Ethers Integration](https://node.tevm.sh/getting-started/ethers)
- 🛠️ [Bundler Quickstart](https://node.tevm.sh/getting-started/bundler)
- 📚 [API Reference](https://node.tevm.sh/api/packages)
- 💡 [Examples](https://github.com/evmts/tevm-monorepo/tree/main/examples)

---

## 👥 Community

- 💬 [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)
- 🗣️ [GitHub Discussions](https://github.com/evmts/tevm-monorepo/discussions)

---

## 🤝 Contributing

We're always looking for passionate builders—especially if you love TypeScript, Zig, L2/L3s, or pushing the limits of EVM tooling. See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## 📄 License

Tevm is fully open source under the MIT license. See [LICENSE](./LICENSE) for details.

---

## 🚦 Who Should Use Tevm?

Tevm is for you if you're:

- 🔧 Building with **viem**, **wagmi**, **0x**, or TypeScript-first Ethereum apps
- ⚡ Shipping UIs that need instant feedback (no spinners)
- 🚀 Creating next-gen dapps, rollups, wallets, or LLM/EVM integrations
- 😤 Tired of slow, fragile, or heavyweight devnets

---

<p align="center">
  <b>❤️ Ready to level up your Ethereum workflow?</b>
  <br><br>
  <a href="https://node.tevm.sh/getting-started/overview">
    <img src="https://img.shields.io/badge/Get%20Started%20with%20Tevm-FF6B6B?style=for-the-badge&logo=ethereum&logoColor=white" alt="Get Started">
  </a>
</p>
