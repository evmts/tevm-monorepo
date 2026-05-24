<p align="center">
  <a href="https://node.tevm.sh">
    <img src="https://github.com/user-attachments/assets/880d8f54-8063-4018-8777-98ba383433ee" width="400" alt="Tevm Logo" />
  </a>
</p>

<h1 align="center">Tevm</h1>

<p align="center">
  <b>JavaScript-native Ethereum runtime for TypeScript apps, tests, and tools.</b>
</p>

<p align="center">
  <a href="https://github.com/evmts/tevm-monorepo/actions/workflows/ci.yml">
    <img src="https://github.com/evmts/tevm-monorepo/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://www.npmjs.com/package/tevm?activeTab=versions">
    <img src="https://img.shields.io/npm/v/tevm/rc?label=rc" alt="NPM RC Version" />
  </a>
  <a href="https://www.npmjs.com/package/tevm">
    <img src="https://img.shields.io/npm/dm/tevm.svg" alt="Tevm Downloads" />
  </a>
  <a href="https://bundlephobia.com/package/tevm">
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

## Release Candidate

Tevm 1.0 is now available on the npm `rc` dist-tag.

```bash
npm install tevm@rc viem
```

The release candidate includes the new block, mining, receipt, txpool, JSON-RPC, tracing, and viem-compatible client work that replaces the older pre-1.0 README examples. The npm `latest` tag may still point at the older `next` series, so use `tevm@rc` when trying the current 1.0 release candidate.

## What Is Tevm?

Tevm runs an Ethereum execution environment inside JavaScript. Use it as an in-memory devnet, a forked-chain simulator, an EIP-1193 provider, a viem-compatible client, or a lower-level EVM toolkit.

It runs in Node, Bun, browsers, serverless functions, edge runtimes, and desktop apps without Docker or a background chain process.

## Why Use It?

- **Fork any EVM chain locally**: run calls against mainnet, L2s, L3s, or appchains while overriding accounts, storage, and block context.
- **Use viem actions directly**: `createMemoryClient` includes viem public, wallet, and Anvil-style test actions.
- **Control mining behavior**: choose automatic, manual, or interval mining and decide when pending transactions become canonical blocks.
- **Inspect real execution**: collect traces, receipts, logs, access lists, created addresses, and block-level results from local execution.
- **Import Solidity in TypeScript**: use Tevm bundler plugins to import Solidity contracts with ABI, bytecode, and type-safe helpers.
- **Run in the browser**: build local-first dapps, optimistic UIs, demos, and tests where a separate RPC node would be too heavy.
- **Extend the EVM**: add custom precompiles, predeploys, decorators, and low-level runtime packages when you need direct control.

## Quick Start

Create a local in-memory chain, add a transaction to the mempool, mine it, and read the receipt.

```typescript
import { createMemoryClient, parseEther } from "tevm";

const client = createMemoryClient({
  miningConfig: { type: "manual" },
});

await client.tevmReady();

const alice = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const bob = "0x1111111111111111111111111111111111111111";

await client.tevmSetAccount({
  address: alice,
  balance: parseEther("1"),
});

const { txHash } = await client.tevmCall({
  from: alice,
  to: bob,
  value: parseEther("0.1"),
  addToMempool: true,
});

if (!txHash) {
  throw new Error("Transaction was not added to the mempool");
}

await client.tevmMine({ blockCount: 1 });

const receipt = await client.getTransactionReceipt({ hash: txHash });
const balance = await client.getBalance({ address: bob });

console.log(receipt.status, balance);
```

## Fork Mainnet Or An L2

Tevm can fork through any EIP-1193 or viem transport. Set `common` when you know the chain to avoid an extra chain-id lookup.

```typescript
import { createMemoryClient, http, parseAbi } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  common: optimism,
  fork: {
    transport: http("https://mainnet.optimism.io"),
    blockTag: "latest",
  },
  miningConfig: { type: "manual" },
});

await client.tevmReady();

const abi = parseAbi(["function balanceOf(address) view returns (uint256)"]);

const balance = await client.readContract({
  address: "0x4200000000000000000000000000000000000042",
  abi,
  functionName: "balanceOf",
  args: ["0x0000000000000000000000000000000000000000"],
});

console.log(balance);
```

## New In The 1.0 RC

- **Blocks and canonical chain state**: Tevm now mines blocks instead of only mutating state snapshots. Calls that create transactions are pending until mined; cheat methods such as `tevmSetAccount` still update canonical state immediately.
- **Mining modes**: configure `miningConfig` with `manual`, `auto`, or `interval` behavior. Use `client.tevmMine()` or viem's Anvil-compatible `client.mine()` to advance the chain.
- **Txpool and receipts**: transactions can enter the mempool, be mined into blocks, and then be queried through viem actions or JSON-RPC methods such as `eth_getTransactionReceipt`.
- **Historical block tags**: `blockTag` works for forked history and locally mined Tevm blocks.
- **State and block overrides**: `tevmCall`, `tevmContract`, `tevmDeploy`, and `eth_call` can run with temporary account, storage, and block overrides.
- **Execution tracing**: use `createTrace` on calls and `traceConfig` on debug APIs to inspect EVM execution for tests, debuggers, and profilers.
- **Synchronous client creation**: `createMemoryClient()` and `createTevmNode()` return synchronously; `client.tevmReady()` and `node.ready()` are available when you want to eagerly wait for initialization.
- **EIP-1193 request support**: `request` now follows the EIP-1193 shape. The previous low-level request helpers are available as `send` and `sendBulk`.
- **Stable decorators**: extend `TevmNode` with `tevmActions`, `ethActions`, `tevmSend`, and `requestEip1193`.
- **Broader JSON-RPC compatibility**: Tevm supports more Ethereum, Anvil, Ganache, and Hardhat-compatible RPC methods for viem test-client workflows.
- **State persistence**: persist and hydrate in-memory client state with synchronous storage using `createSyncStoragePersister`.
- **Runtime packages**: the monorepo now includes Tevm-native block, blockchain, tx, txpool, receipt-manager, state, VM, and utility packages.

## API Surface

### Memory Client

`createMemoryClient` is the easiest entry point. It returns a viem client with Tevm actions and Anvil-style test actions already installed.

```typescript
import { createMemoryClient } from "tevm";

const client = createMemoryClient({
  miningConfig: { type: "auto" },
});

await client.tevmReady();
await client.tevmSetAccount({ address: "0x0000000000000000000000000000000000000001", balance: 1n });
await client.getBlockNumber();
```

### Tevm Node

`createTevmNode` gives lower-level access to the runtime and decorator model.

```typescript
import { createTevmNode } from "tevm";
import { requestEip1193, tevmActions } from "tevm/decorators";

const node = createTevmNode({ miningConfig: { type: "manual" } })
  .extend(tevmActions())
  .extend(requestEip1193());

await node.ready();

const chainId = await node.request({ method: "eth_chainId" });
```

### Solidity Imports

Tevm bundler plugins let TypeScript import Solidity modules directly.

```typescript
import { createMemoryClient } from "tevm";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20.sol";

const client = createMemoryClient();
const token = ERC20.withAddress("0x0000000000000000000000000000000000000000");

const balance = await client.tevmContract(
  token.read.balanceOf("0x0000000000000000000000000000000000000001"),
);
```

`tevm.json` is optional in the RC series. Use package-specific bundler docs for Vite, Webpack, Bun, esbuild, rspack, and other integrations.

## Packages

The `tevm` package re-exports the most common runtime APIs. Individual packages remain available when you want smaller imports or lower-level control.

| Package | Purpose |
| --- | --- |
| `tevm` | Main batteries-included package |
| `@tevm/memory-client` | viem-compatible in-memory Ethereum client |
| `@tevm/node` | Low-level Tevm node and decorator runtime |
| `@tevm/actions` | Tevm actions, JSON-RPC handlers, and debug APIs |
| `@tevm/decorators` | Client extensions for actions, EIP-1193, and events |
| `@tevm/block`, `@tevm/blockchain`, `@tevm/tx`, `@tevm/txpool` | Chain, block, transaction, and mempool internals |
| `@tevm/receipt-manager` | Receipt storage and lookup |
| `@tevm/state`, `@tevm/vm`, `@tevm/evm` | State manager and execution internals |
| `@tevm/sync-storage-persister` | Synchronous persistence for browser or embedded storage |

## Learn More

- [Getting Started](https://node.tevm.sh/getting-started/overview)
- [Viem Integration](https://node.tevm.sh/getting-started/viem)
- [Ethers Integration](https://node.tevm.sh/getting-started/ethers)
- [Bundler Quickstart](https://node.tevm.sh/getting-started/bundler)
- [API Reference](https://node.tevm.sh/api/packages)
- [Examples](https://github.com/evmts/tevm-monorepo/tree/main/examples)

## Community

- [Telegram](https://t.me/+ANThR9bHDLAwMjUx)
- [GitHub Discussions](https://github.com/evmts/tevm-monorepo/discussions)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, testing, and pull-request guidance.

## License

Tevm is MIT licensed. See [LICENSE](./LICENSE) for details.
