---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## Low-Level API Guide

The low-level API for TEVM clients provides advanced functionalities and detailed control over the EVM and blockchain states. While the actions API is sufficient for most use cases, the low-level API can be extremely useful in advanced scenarios.

### Introduction

TEVM clients are viem clients configured to use TEVM as their transport option. Onboarding onto using TEVM is minimal because TEVM leverages viem as its highest-level public API, minimizing switching costs between TEVM and other tools. Additionally, ethers.js is supported as well.

The low-level API offers direct access to various components of the EVM, such as the VM, blockchain, state manager, and more. These components are essential for developers who need fine-grained control over their Ethereum development and testing environments.

### Accessing the Low-Level API

To access the low-level API, you need to interact with the underlying VM and its components. Here's how you can do it using a TEVM client:

```typescript
import { createClient, http } from "viem";
import { createTevmTransport } from "tevm";
import { optimism } from "tevm/common";

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http("https://mainnet.optimism.io")({}) },
  }),
  chain: optimism,
});

async function accessLowLevelAPI() {
  const vm = await client.transport.tevm.getVm();

  // VM functions
  vm.deepCopy();
  vm.runBlock();
  vm.buildBlock();

  // Blockchain functions
  const { blockchain } = vm;
  blockchain.deepCopy();
  blockchain.getBlock();
  blockchain.putBlock();
  blockchain.delBlock();
  blockchain.getCanonicalHeadBlock();
  blockchain.blocksByTag();
  blockchain.consensus();
  blockchain.validateHeader();

  // StateManager functions
  const { stateManager } = vm;
  stateManager.deepCopy();
  stateManager.setStateRoot();
  stateManager.getAccount();
  stateManager.putAccount();
  stateManager.dumpStorageRange();

  // EVM functions
  const { evm } = vm;
  evm.runCall({ data: new Uint8Array() }).then(console.log);

  // Mempool functions
  const mempool = await client.transport.tevm.getTxPool();
  mempool.add();
  mempool.addUnverified();
  mempool.getByHash();
  mempool.removeByHash();
  mempool.getBySenderAddress();
  mempool.txsByPriceAndNonce();

  // ReceiptManager functions
  const receiptManager = await client.transport.tevm.getReceiptsManager();
  receiptManager.getLogs();
  receiptManager.saveReceipts();
  receiptManager.getReceipts();
  receiptManager.getReceiptByTxHash();
}

accessLowLevelAPI();
```

### Low-Level API Functions

#### VM Functions

- **`deepCopy()`**: Creates a deep copy of the VM.
- **`runBlock()`**: Executes a block on the VM.
- **`buildBlock()`**: Builds a block with the current state.

#### Blockchain Functions

- **`deepCopy()`**: Creates a deep copy of the blockchain.
- **`getBlock()`**: Retrieves a block by its hash or number.
- **`putBlock()`**: Inserts a block into the blockchain.
- **`delBlock()`**: Deletes a block from the blockchain.
- **`getCanonicalHeadBlock()`**: Gets the canonical head block of the blockchain.
- **`blocksByTag()`**: Retrieves blocks by their tags.
- **`consensus()`**: Accesses the consensus mechanism.
- **`validateHeader()`**: Validates a block header.

#### StateManager Functions

The state manager follows the [ethereumjs StateManager interface](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager), but it is a custom implementation that does not use a trie for simplicity and performance.

- **`deepCopy()`**: Creates a deep copy of the state manager.
- **`setStateRoot()`**: Sets the state root.
- **`getAccount()`**: Retrieves an account by its address.
- **`putAccount()`**: Inserts or updates an account.
- **`dumpStorageRange()`**: Dumps a range of storage values.

There are two ways of saving state:

1. **`saveStateRoot`**: Dumps the state and saves it under a state root hash.
2. **`checkpoint()`, `commit()`, `revert()`**: Used by the EVM to checkpoint the current state.

### Transactions

TEVM reuses the [EthereumJS transaction types](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx). As of now, TEVM officially supports EIP4844 and EIP1559 transaction types. Legacy transactions are often supported, while custom transactions such as Optimism deposit transactions are not currently supported but will be in the future.

#### Transaction Examples

```typescript
import { BlobEIP4844Transaction } from "@tevm/tx";

const tx = BlobEIP4844Transaction.fromTxData(
  {
    to: Address.zero(),
    blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
  },
  { common },
);

const tx = FeeMarketEIP1559Transaction.fromTxData(
  {
    maxFeePerGas: 10,
    maxPriorityFeePerGas: 8,
  },
  { common },
);
```

### Common

`Common` represents chain-specific configuration. It extends the viem chain interface, adding an `ethjsCommon` property which extends the EthereumJS common interface.

All officially supported common chains can be imported from `tevm/common`.

#### Creating a Common

```typescript
import { base as _base } from "viem/chains";
import { createCommon } from "../createCommon.js";

export const base = createCommon({
  ..._base,
  loggingLevel: "warn",
  eips: [],
  hardfork: "cancun",
});
```

### State Management

The `StateManager` interface provides methods for managing accounts, storage, and state roots. It implements the [EthereumJS StateManager interface](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager).

#### StateManager Interface

```typescript
import type { EVMStateManagerInterface } from "@tevm/common";
import type { Address } from "viem";
import type { BaseState } from "./BaseState.js";
import type { TevmState } from "./state-types/index.js";

export interface StateManager extends EVMStateManagerInterface {
  _baseState: BaseState;
  ready: BaseState["ready"];
  getAccountAddresses: () => Address[];
  deepCopy(): Promise<StateManager>;
  dumpCanonicalGenesis(): Promise<TevmState>;
  clearCaches(): void;
  saveStateRoot(root: Uint8Array, state: TevmState): void;
  commit(createNewStateRoot?: boolean): Promise<void>;
}
```

### EVM

The EVM is the low-level bytecode interpreter. It reuses the [EthereumJS EVM package](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm). Its main API is `runCall`.

```typescript
import { hexToBytes, encodeFunctionData } from "viem/utils";

vm.evm.runCall({
  to,
  data: hexToBytes(
    encodeFunctionData({
      functionName: "getL1GasUsed",
      args: [serializedTx],
      abi,
    }),
  ),
});
```

### VM

The VM wraps the EVM, state manager, and blockchain to manage mining blocks and running transactions. The TEVM VM is a fork and reimplementation of the [EthereumJS VM package](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm).

```typescript
import { runTx } from "@tevm/actions";

runTx(vmClone)({
  block: parentBlock,
  skipNonce: true,
  skipBalance: true,
  skipHardForkValidation: true,
  skipBlockGasLimitValidation: true,
  tx: await TransactionFactory.fromRPC(tx, {
    freeze: false,
    common: vmClone.common.ethjsCommon,
    allowUnlimitedInitCodeSize: true,
  }),
});
```

### TxPool

The transaction pool (txPool) is used to manage unmined transactions. When a transaction is created with `createTransaction: true` or submitted via `eth_sendRawTransaction`, it is added to the pool. Transactions in the pool are then ordered by nonce and priority, and executed one by one using `runTx` when a block is mined.

### Block

TEVM reimplements the [EthereumJS block package](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block) with minor changes to support impersonated transactions.

### Blockchain

TEVM implements its own simpler blockchain implementation as it is not a full node. TEVM's blockchain has a Consensus property to match the EthereumJS interface but does not use consensus at this time. This functionality could be added in the future. The TEVM blockchain is a reimplementation of the [EthereumJS blockchain package](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain).

### Notable Mention

The [EthereumJS client package](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client) has its own JSON-RPC API like TEVM and might be a better choice if you are looking to run a full node.
