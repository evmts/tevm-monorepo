---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---

## TevmNode

TevmNode is a local evm blockchain instance that can be used programatically in Node.js or browser.

:::[tip] When to use TevmNode
Most users are best off using the higher level recomended [Viem client api](../clients/index.md).

Using TevmNode directly can be a great choice if

- you want to use Tevm in the most minimal tree shakable way
- you need low level control of the evm node
  :::

## Installation

TevmNode is available in `tevm` package under `tevm/node` or as a standalone package

```ts
npm install @tevm/node
```

## Creating a TevmNode

### createTevmNode

Create a TevmNode using `createTevmNode`

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
```

### Accessing underlying TevmNode on a viem client

TevmNode is also available on [viem clients](../clients/index.md) using Tevm including MemoryClient

```typescript
import { type TevmNode } from "tevm/node";

const tevm: TevmNode = client.transport.tevm;
```

### TevmOptions

See [TevmOptions](../../reference/@tevm/node/type-aliases/TevmNode.md) docs for options that can be passed to TevmNode.

### TevmNode.ready()

Resolves true when the client is initialized.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
await tevm.ready();
// tevm is now ready to use
```

It is not strictly required to wait for tevm.ready(). The entire api will implicitly wait for tevm to be ready if it needs to.

## Adding EIP-1193 Provider

TevmNode can become an EIP-1193 Provider using [requestEip1193](https://tevm.sh/reference/tevm/decorators/functions/requesteip1193/) decorator from `tevm/decorators` package.

```typescript
import { createTevmNode } from "tevm/node";
import { requestEip1193 } from "tevm/decorators";

const tevm = createTevmNode().extend(requestEip1193());
const blockNumber = await tevm.request({ method: "eth_getBlockNumber" });
```

See [json-rpc api](../json-rpc/) for which methods are supported.

## Using a TevmNode

In addition to being used as an EIP-1193 provider, a TevmNode has direct access to all it's internals including

- VM - the internal vm
- Blockchain - the blockchain sub component of the vm
- StateManager - the state sub component of the vm
- EVM - The raw EVM interpreter on the vm
- TxPool - A cache of unmined tx
- ReceiptsManager - A cache of receipts and log information

### VM

The internal Vm can be accessed using getVm. getVm will wait for `await tevm.ready()` to be true and then return the vm instance.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();

const vm = await tevm.getVm();
```

Notable methods include:

- `vm.runBlock({block})` to execute an entire block of tx
- `vm.runTx({tx})` to execute a single tx on the vm

The VM is also how you get access to it's sub components including the blockchain, the state manager, and the evm.

**See [generated Vm docs](../../reference/@tevm/vm/type-aliases/Vm.md) for it's usage.**
**The VM can be used as a standalone package using `@tevm/vm` package. See generated docs for more**

### StateManager

The Tevm StateManager controls account state, contract bytecode, and contract storage. It supports forking via lazily fetching state from the fork if not already cached.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();

const stateManager = await tevm.getVm().then((vm) => vm.stateManager);
console.log(await stateManager.dumpCannonicalGenesis());
```

Notable methods include

- `stateManager.getAccount` to get an Account from state
- `stateManager.putAccount` to add or update an Account
- `stateManager.putContractStorage` to add contract storage
- `stateManager.setStateRoot(block.header.stateRoot)` to update the state to the state of a given block
- many more

**See [generated StateManager docs](../../reference/@tevm/vm/type-aliases/Vm.md) for it's usage.**
**The StateManager can be used as a standalone package using `@tevm/state` package. See generated docs for more**

### Blockchain

The blockchain controls the state of blocks. It supports forking via lazily fetching blocks from the fork if not already cached.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();

const blockchain = await tevm.getVm().then((vm) => vm.blockchain);
console.log(await blockchain.getBlock(420n));
```

Notable methods include

- `blockchain.getBlock` to get a block
- `blockchain.getCanonicalHeadBlock` to get the latest block
- `blockchain.putBlock` to add or update a block
- many more

**See [generated StateManager docs](../../reference/@tevm/vm/type-aliases/Vm.md) for it's usage.**
**The Blockchain can be used as a standalone package using `@tevm/blockchain` package. See generated docs for more**
**Blockchain package uses [@tevm/block](../../reference/@tevm/block/functions/blockFromRpc.md)** to fetch blocks from rpc and create blocks

### Evm

The EVM is the raw EVM interpreter of the TevmNode. It is an extremely light wrapper around [ethereumjs](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

```typescript
import { createTevmNode } from "tevm/node";
import { createAddress } from "tevm/address";

const tevm = createTevmNode();

const evm = await tevm.getVm().then((vm) => vm.evm);
console.log(
  await evm.runCall({
    from: createAddress(0),
    to: createAddress(1),
    data: Uint8Array.from([0]),
  }),
);
```

EVM has one notable method on it, `runCall` which runs a call on the EVM. `runCall` is just raw execution and does not do things like deduct the base fee. See `vm.runTx` if you wish to deduct base fees and do other checks.

**See [generated EVM docs](../../reference/@tevm/evm/functions/createEvm.md) for it's usage.**
**The EVM can be used as a standalone package using `@tevm/evm` package. See generated docs for more**

### Copying or Forking a node

TevmNode can fork another TevmNode by passing it into `fork.transport`

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const forkedTevm = createTevmNode({
  fork: { transport: tevm },
});
```

Forking should be the default as it's the most performant way to create a new TevmNode instance. But you can also deep copy a TevmNode.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const tevmCopy = tevm.deepCopy();
```

### Adding and removing Filters

The following methods allow you to read and write filters to the node:

- [`TevmNode.getFilters`](../../reference/@tevm/node/type-aliases/TevmNode.md#getFilters) Returns a Mapping of filters
- [`TevmNode.removeFilter`](../../reference/@tevm/node/type-aliases/TevmNode.md#removeFilter) Used to remove a filter
- [`TevmNode.addFilter`](../../reference/@tevm/node/type-aliases/TevmNode.md#addFilter) Used to add a filter

### TevmNode.getReceiptsManager()

This internal cache is used by tevm clients to cache receipt and log information.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const manager = await tevm.getReceiptsManager();
```

Note: the VM does not cache anything in the receipts manager.

### TevmNode.getTxPool()

The TxPool is used by Tevm to represent unmined tx. json-rpc methods such as `eth_sendRawTransaction` work via adding the tx to the tx pool. It is also used to represent json-rpc requests using block tag `pending`.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const mempool = await tevm.getTxPool();

const txs = await mempool.getBySenderAddress();
```

### TevmNode.logger

The internal logger used by tevm. Useful to use if you are building extensions around tevm.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
tevm.logger.warn("Custom warning");
```

## Adding additional functionality to a TevmNode

There are a few packages that add additional functionality to a TevmNode in a tree shakable way.

- `tevm/actions` Tree shakable methods such as `call`, `getBlockNumber`, and more for interacting with a TevmNode
- `tevm/procedures` Tree shakable methods for implementing the JSON-RPC api for ethereum, hardhat, anvil, and custom tevm json-rpc methods.
- `tevm/decorators` Extensions to add additional properties to a TevmNode

### Extending with actions

Actions are high level methods for interacting with a Node.

Towards the beginning of this page we extend a TevmNode with a EIP-1193 request fn. Tevm has other extensions too.

#### [ethActions](https://tevm.sh/reference/tevm/decorators/functions/ethactions/)

Adds an `eth` property that contains methods that map 1 to 1 with the ethereum json-rpc api.

```typescript
import { createTevmNode } from "tevm/node";
import { ethActions } from "tevm/decorators";

const tevm = createTevmNode().extend(ethActions());
const blockNumber = await tevm.eth.getBlockNumber();
```

These ethereum handlers are the same handlers used to implement the JSON-RPC api.

#### [tevmActions](https://tevm.sh/reference/tevm/decorators/functions/tevmactions/)

These actions are tevm specific and also available for [`ViemClients`](../clients/)

```typescript
import { createTevmNode } from "tevm/node";
import { tevmActions } from "tevm/decorators";

const tevm = createTevmNode().extend(tevmActions());
await tevm.setAccount({ address: `0x${"11".repeat(20)}`, balance: 420n });
```

For more information read the [Tevm Actions guide](https://tevm.sh/learn/actions/#tevmclient-actions)

### Using tree shakable actions

All TevmNode actions are also available as tree shakable actions in the `tevm/actions` package. The usage for Tevm is similar but a little different than the viem api.

```typescript
import { createTevmNode } from "tevm/node";
import { setAccount } from "tevm/actions";

const tevm = createTevmNode().extend(tevmActions());
await setAccount(tevm)({
  address: `0x${"11".repeat(20)}`,
  balance: 420n,
});
```

See the `tevmActions` and `ethActions` extensions if you would like to add these actions to your client instance directly because tree shaking is not a concern.

All procedures for the JSON-RPC api are optionally available in `tevm/procedures` package.

```typescript
import { ethGetBlockNumberProcedure } from "tevm/procedures";
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode().extend(tevmActions());
const response = await ethGetBlockNumberProcedure(tevm)({
  id: 1,
  jsonrpc: "2.0",
  method: "eth_getBlockNumber",
});
```

## Usage via viem and ethers api

For most users it is recomended you use a battle tested javascript ethereum provider implementation such as Viem or ethers. This gives you a robust and familiar api for interacting with tevm. Direct access to the tevm node is still available.

```typescript
import { createTevmTransport, createClient } from "tevm";

const client = createClient({ transport: createTevmTransport() });

// you still have access to the tevm node
const tevmNode = client.transport.tevm;

const vm = await tevmNode.getVm();
```

For ethers providers tevm node is available on `Provider.tevm`
