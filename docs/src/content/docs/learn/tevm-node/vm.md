---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

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

