---
editUrl: false
next: false
prev: false
title: "Evm"
---

## Extends

- `EVM`

## Constructors

### new Evm()

> `protected` **new Evm**(`opts`, `bn128`): [`Evm`](/reference/tevm/evm/classes/evm/)

Creates new EVM object

:::caution[Deprecated]
The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async EVM.create constructor instead (same API).
:::

#### Parameters

• **opts**: `EVMOpts`

The EVM options

• **bn128**: `bn128`

Initialized bn128 WASM object for precompile usage (internal)

#### Returns

[`Evm`](/reference/tevm/evm/classes/evm/)

#### Inherited from

`EthereumEVM.constructor`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:78

## Properties

### \_block?

> `protected` `optional` **\_block**: `Block`

#### Inherited from

`EthereumEVM._block`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

***

### \_bls?

> `protected` `readonly` `optional` **\_bls**: `EVMBLSInterface`

#### Inherited from

`EthereumEVM._bls`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:47

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes**: `CustomOpcode`[]

#### Inherited from

`EthereumEVM._customOpcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

***

### \_customPrecompiles

> `protected` **\_customPrecompiles**: `CustomPrecompile`[]

#### Overrides

`EthereumEVM._customPrecompiles`

#### Defined in

[packages/evm/src/EvmType.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L14)

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

`EthereumEVM._dynamicGasHandlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

***

### \_emit()

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **data**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._emit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

***

### \_handlers

> `protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

`EthereumEVM._handlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

#### Inherited from

`EthereumEVM._opcodeMap`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

#### Inherited from

`EthereumEVM._opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

#### Inherited from

`EthereumEVM._optsCached`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EthereumEVM._precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

***

### \_tx?

> `protected` `optional` **\_tx**: `object`

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

`EthereumEVM._tx`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

#### Inherited from

`EthereumEVM.allowUnlimitedContractSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

`EthereumEVM.allowUnlimitedInitCodeSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

***

### blockchain

> **blockchain**: `Blockchain`

#### Inherited from

`EthereumEVM.blockchain`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EthereumEVM.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

***

### events

> `readonly` **events**: [`AsyncEventEmitter`](/reference/tevm/utils/classes/asynceventemitter/)\<`EVMEvents`\>

#### Inherited from

`EthereumEVM.events`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

***

### journal

> **journal**: `Journal`

#### Inherited from

`EthereumEVM.journal`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

`EthereumEVM.performanceLogger`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

***

### stateManager

> **stateManager**: `StateManager`

#### Overrides

`EthereumEVM.stateManager`

#### Defined in

[packages/evm/src/EvmType.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L13)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

#### Inherited from

`EthereumEVM.transientStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: `Hardfork`[]

#### Inherited from

`EthereumEVM.supportedHardforks`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

> `get` **opcodes**(): `OpcodeList`

#### Returns

`OpcodeList`

#### Inherited from

`EthereumEVM.opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

***

### precompiles

> `get` **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EthereumEVM.precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

• **toAccount**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

• **message**: `MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._addToBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:113

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

• **message**: `MessageWithTo`

#### Returns

`Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Inherited from

`EthereumEVM._executeCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Inherited from

`EthereumEVM._executeCreate`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:85

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)\>

#### Inherited from

`EthereumEVM._generateAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._loadCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

• **account**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._reduceSenderBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:112

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

[packages/evm/src/EvmType.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L16)

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Returns

`void`

#### Inherited from

`EthereumEVM.clearPerformanceLogs`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:132

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EthereumEVM.getActiveOpcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

#### Returns

`object`

##### opcodes

> **opcodes**: `EVMPerformanceLogOutput`[]

##### precompiles

> **precompiles**: `EVMPerformanceLogOutput`[]

#### Inherited from

`EthereumEVM.getPerformanceLogs`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:128

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`undefined` \| `PrecompileFunc`

#### Inherited from

`EthereumEVM.getPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:105

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

[packages/evm/src/EvmType.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L17)

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

• **opts**: [`EvmRunCallOpts`](/reference/tevm/evm/interfaces/evmruncallopts/)

#### Returns

`Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Inherited from

`EthereumEVM.runCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:95

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

• **opts**: `EVMRunCodeOpts`

#### Returns

`Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

#### Inherited from

`EthereumEVM.runCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:100

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts`?): `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

• **opts?**: `InterpreterOpts`

#### Returns

`Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

#### Inherited from

`EthereumEVM.runInterpreter`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

***

### runPrecompile()

> `protected` **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](/reference/tevm/evm/interfaces/execresult/) \| `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

• **code**: `PrecompileFunc`

• **data**: `Uint8Array`

• **gasLimit**: `bigint`

#### Returns

[`ExecResult`](/reference/tevm/evm/interfaces/execresult/) \| `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

#### Inherited from

`EthereumEVM.runPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:109

***

### shallowCopy()

> **shallowCopy**(): `EVM`

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM

#### Inherited from

`EthereumEVM.shallowCopy`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:127

***

### create()

> `static` **create**(`options`?): `Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

Use this async static constructor for the initialization
of an EVM object

#### Parameters

• **options?**: `EVMOpts`

#### Returns

`Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

A new EVM

#### Overrides

`EthereumEVM.create`

#### Defined in

[packages/evm/src/EvmType.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L18)
