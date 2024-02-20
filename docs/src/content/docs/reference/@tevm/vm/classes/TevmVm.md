---
editUrl: false
next: false
prev: false
title: "TevmVm"
---

## Extends

- `VM`

## Constructors

### new TevmVm(opts)

> **`protected`** **new TevmVm**(`opts`?): [`TevmVm`](/reference/tevm/vm/classes/tevmvm/)

Instantiates a new [VM]([object Object]) Object.

:::caution[Deprecated]
The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async [VM.create]([object Object]) constructor instead (same API).
:::

#### Parameters

▪ **opts?**: `VMOpts`

#### Returns

#### Inherited from

VM.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:63

## Properties

### \_isInitialized

> **`protected`** **\_isInitialized**: `boolean`

#### Inherited from

VM.\_isInitialized

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:32

***

### \_opts

> **`protected`** **`readonly`** **\_opts**: `VMOpts`

#### Inherited from

VM.\_opts

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:31

***

### \_setHardfork

> **`protected`** **`readonly`** **\_setHardfork**: `boolean` \| `BigIntLike`

#### Inherited from

VM.\_setHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:33

***

### blockchain

> **blockchain**: [`TevmBlockchain`](/reference/tevm/blockchain/classes/tevmblockchain/)

#### Overrides

VM.blockchain

#### Source

[packages/vm/src/TevmVm.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L9)

***

### common

> **common**: [`TevmCommon`](/reference/tevm/common/classes/tevmcommon/)

#### Overrides

VM.common

#### Source

[packages/vm/src/TevmVm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L10)

***

### events

> **`readonly`** **events**: `AsyncEventEmitter`\<`VMEvents`\>

#### Inherited from

VM.events

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:26

***

### evm

> **evm**: [`Evm`](/reference/tevm/evm/classes/evm/)

#### Overrides

VM.evm

#### Source

[packages/vm/src/TevmVm.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L8)

***

### stateManager

> **stateManager**: [`TevmStateManager`](/reference/tevm/state/type-aliases/tevmstatemanager/)

#### Overrides

VM.stateManager

#### Source

[packages/vm/src/TevmVm.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L28)

## Methods

### buildBlock()

> **buildBlock**(`opts`): `Promise`\<`BlockBuilder`\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on [BlockBuilder.build]([object Object])
or discarded with [BlockBuilder.revert]([object Object]).

#### Parameters

▪ **opts**: `BuildBlockOpts`

#### Returns

An instance of [BlockBuilder]([object Object]) with methods:
- [BlockBuilder.addTransaction]([object Object])
- [BlockBuilder.build]([object Object])
- [BlockBuilder.revert]([object Object])

#### Inherited from

VM.buildBlock

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:102

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`TevmVm`](/reference/tevm/vm/classes/tevmvm/)\>

#### Source

[packages/vm/src/TevmVm.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L30)

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Inherited from

VM.errorStr

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:120

***

### init()

> **init**(`__namedParameters`?): `Promise`\<`void`\>

#### Parameters

▪ **\_\_namedParameters?**: `object`

▪ **\_\_namedParameters.genesisState?**: `GenesisState`

#### Inherited from

VM.init

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:64

***

### runBlock()

> **runBlock**(`opts`): `Promise`\<`RunBlockResult`\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

▪ **opts**: `RunBlockOpts`

Default values for options:
 - `generate`: false

#### Inherited from

VM.runBlock

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:77

***

### runTx()

> **runTx**(`opts`): `Promise`\<`RunTxResult`\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

▪ **opts**: `RunTxOpts`

#### Inherited from

VM.runTx

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:87

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): `Promise`\<`VM`\>

Returns a copy of the [VM]([object Object]) instance.

Note that the returned copy will share the same db as the original for the blockchain and the statemanager.

Associated caches will be deleted and caches will be re-initialized for a more short-term focused
usage, being less memory intense (the statemanager caches will switch to using an ORDERED_MAP cache
datastructure more suitable for short-term usage, the trie node LRU cache will not be activated at all).
To fine-tune this behavior (if the shallow-copy-returned object has a longer life span e.g.) you can set
the `downlevelCaches` option to `false`.

#### Parameters

▪ **downlevelCaches?**: `boolean`

Downlevel (so: adopted for short-term usage) associated state caches (default: true)

#### Inherited from

VM.shallowCopy

#### Source

node\_modules/.pnpm/@ethereumjs+vm@7.1.0/node\_modules/@ethereumjs/vm/dist/esm/vm.d.ts:116

***

### create()

> **`static`** **create**(`opts`): `Promise`\<[`TevmVm`](/reference/tevm/vm/classes/tevmvm/)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

▪ **opts**: `undefined` \| `VMOpts`= `{}`

VM engine constructor options

#### Overrides

VM.create

#### Source

[packages/vm/src/TevmVm.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
