[@tevm/vm](../README.md) / [Exports](../modules.md) / TevmVm

# Class: TevmVm

## Hierarchy

- `VM`

  ↳ **`TevmVm`**

## Table of contents

### Constructors

- [constructor](TevmVm.md#constructor)

### Properties

- [\_isInitialized](TevmVm.md#_isinitialized)
- [\_opts](TevmVm.md#_opts)
- [\_setHardfork](TevmVm.md#_sethardfork)
- [blockchain](TevmVm.md#blockchain)
- [common](TevmVm.md#common)
- [events](TevmVm.md#events)
- [evm](TevmVm.md#evm)
- [stateManager](TevmVm.md#statemanager)

### Methods

- [buildBlock](TevmVm.md#buildblock)
- [deepCopy](TevmVm.md#deepcopy)
- [errorStr](TevmVm.md#errorstr)
- [init](TevmVm.md#init)
- [runBlock](TevmVm.md#runblock)
- [runTx](TevmVm.md#runtx)
- [shallowCopy](TevmVm.md#shallowcopy)
- [create](TevmVm.md#create)

## Constructors

### constructor

• **new TevmVm**(`opts?`): [`TevmVm`](TevmVm.md)

Instantiates a new VM Object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `VMOpts` |

#### Returns

[`TevmVm`](TevmVm.md)

**`Deprecated`**

The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async VM.create constructor instead (same API).

#### Inherited from

VM.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:63

## Properties

### \_isInitialized

• `Protected` **\_isInitialized**: `boolean`

#### Inherited from

VM.\_isInitialized

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:32

___

### \_opts

• `Protected` `Readonly` **\_opts**: `VMOpts`

#### Inherited from

VM.\_opts

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:31

___

### \_setHardfork

• `Protected` `Readonly` **\_setHardfork**: `boolean` \| `BigIntLike`

#### Inherited from

VM.\_setHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:33

___

### blockchain

• **blockchain**: `TevmBlockchain`

#### Overrides

VM.blockchain

#### Defined in

[packages/vm/src/TevmVm.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L9)

___

### common

• **common**: `TevmCommon`

#### Overrides

VM.common

#### Defined in

[packages/vm/src/TevmVm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L10)

___

### events

• `Readonly` **events**: `AsyncEventEmitter`\<`VMEvents`\>

#### Inherited from

VM.events

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:26

___

### evm

• **evm**: `Evm`

#### Overrides

VM.evm

#### Defined in

[packages/vm/src/TevmVm.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L8)

___

### stateManager

• **stateManager**: `TevmStateManager`

#### Overrides

VM.stateManager

#### Defined in

[packages/vm/src/TevmVm.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L28)

## Methods

### buildBlock

▸ **buildBlock**(`opts`): `Promise`\<`BlockBuilder`\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on BlockBuilder.build
or discarded with BlockBuilder.revert.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `BuildBlockOpts` |

#### Returns

`Promise`\<`BlockBuilder`\>

An instance of BlockBuilder with methods:
- BlockBuilder.addTransaction
- BlockBuilder.build
- BlockBuilder.revert

#### Inherited from

VM.buildBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:102

___

### deepCopy

▸ **deepCopy**(): `Promise`\<[`TevmVm`](TevmVm.md)\>

#### Returns

`Promise`\<[`TevmVm`](TevmVm.md)\>

#### Defined in

[packages/vm/src/TevmVm.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L30)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

VM.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:120

___

### init

▸ **init**(`«destructured»?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `genesisState?` | `GenesisState` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

VM.init

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:64

___

### runBlock

▸ **runBlock**(`opts`): `Promise`\<`RunBlockResult`\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `RunBlockOpts` | Default values for options: - `generate`: false |

#### Returns

`Promise`\<`RunBlockResult`\>

#### Inherited from

VM.runBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:77

___

### runTx

▸ **runTx**(`opts`): `Promise`\<`RunTxResult`\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `RunTxOpts` |

#### Returns

`Promise`\<`RunTxResult`\>

#### Inherited from

VM.runTx

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:87

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): `Promise`\<`VM`\>

Returns a copy of the VM instance.

Note that the returned copy will share the same db as the original for the blockchain and the statemanager.

Associated caches will be deleted and caches will be re-initialized for a more short-term focused
usage, being less memory intense (the statemanager caches will switch to using an ORDERED_MAP cache
datastructure more suitable for short-term usage, the trie node LRU cache will not be activated at all).
To fine-tune this behavior (if the shallow-copy-returned object has a longer life span e.g.) you can set
the `downlevelCaches` option to `false`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `downlevelCaches?` | `boolean` | Downlevel (so: adopted for short-term usage) associated state caches (default: true) |

#### Returns

`Promise`\<`VM`\>

#### Inherited from

VM.shallowCopy

#### Defined in

node_modules/.pnpm/@ethereumjs+vm@7.1.0/node_modules/@ethereumjs/vm/dist/esm/vm.d.ts:116

___

### create

▸ **create**(`opts?`): `Promise`\<[`TevmVm`](TevmVm.md)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `undefined` \| `VMOpts` | VM engine constructor options |

#### Returns

`Promise`\<[`TevmVm`](TevmVm.md)\>

#### Overrides

VM.create

#### Defined in

[packages/vm/src/TevmVm.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/TevmVm.ts#L16)
