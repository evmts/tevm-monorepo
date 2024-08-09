---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---

## TevmNode

TevmNode is a local evm blockchain instance that can be used programatically in Node.js or browser.

:::[tip] When to use TevmNode
Most users are best off using the recomended [Viem client](../clients/index.md).

Using TevmNode directly can be a great choice if

- you want to use Tevm in the most minimal tree shakable way
- you need low level control of the evm node

If you use the viem api you still have access to the underlying tevm node with `client.transport.tevm`
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

TevmNode is also available on [viem clients](../clients/index.md) using Tevm including MemoryClient

```typescript
import { type TevmNode } from "tevm/node";

const tevm: TevmNode = client.transport.tevm;
```

### TevmOptions

See [TevmOptions]() docs for options that can be passed to TevmNode.

### TevmNode.ready()

Resolves true when the client is initialized.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
await tevm.ready();
// tevm is now ready to use
```

It is not strictly required to wait for tevm.ready(). The entire api will implicitly wait for tevm to be ready if it needs to.

## Using a TevmNode

### VM

The internal Vm can be accessed using getVm. getVm will wait for `await tevm.ready()` to be true and then return the vm instance.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();

const vm = await tevm.getVm();
```

See [Vm docs](../vm/) for it's usage.

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

### Filters

The following methods allow you to read and write filters to the node:

- [`TevmNode.getFilters`](https://tevm.sh/reference/tevm/base-client/type-aliases/baseclient/#getfilters) Returns a Mapping of filters
- [`TevmNode.removeFilter`] Used to remove a filter
- [`TevmNode.getFilters`] Used to get a filter

TODO fix above links

### TevmNode.getReceiptsManager()

This internal cache is used by tevm clients to cache receipt and log information.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const manager = await tevm.getReceiptsManager();
```

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

### Adding EIP-1193 Provider

TevmNode can become an EIP-1193 Provider using [requestEip1193](https://tevm.sh/reference/tevm/decorators/functions/requesteip1193/) decorator from `tevm/decorators` package.

```typescript
import { createTevmNode } from "tevm/node";
import { requestEip1193 } from "tevm/decorators";

const tevm = createTevmNode().extend(requestEip1193());
const blockNumber = await tevm.request({ method: "eth_getBlockNumber" });
```

See [json-rpc api](../json-rpc/) for which methods are supported.

### Extending with actions

Actions are high level methods for interacting with a Node.

In above section we extended a TevmNode with a EIP-1193 request fn. Tevm has other extensions too.

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

## Creating your own custom Node implementation

All the libraries used to create a TevmNode are also available. They follow the ethereumjs api adding custom tevm functionality.

For extreme use cases it can be benificial to implement your own custom EVM or StateManager to create your own client.

The [source code for createTevmClient is small](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/createBaseClient.js)

Under the hood it's using the following tevm packages

- [@tevm/common]() used to represent chain specific information such as EIPs hardforks and fee info. The Tevm common wraps viem/chains and ethereumjs/common
- [@tevm/vm]() Composes the evm, state, and blockchain to do things like run blocks and tx
- [@tevm/evm]() the evm interpreter implementation. Light wrapper around ethereumjs
- [@tevm/state]() a custom ethereumjs state manager that supports forking
- [@tevm/blockchain]() a custom ethereumjs blockchain implementation that supports forking
