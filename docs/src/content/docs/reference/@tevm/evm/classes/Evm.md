---
editUrl: false
next: false
prev: false
title: "Evm"
---

A wrapper around the EVM to expose some protected functionality of the EVMStateManger
Ideally we find a way to remove this complexity and replace with a normal `action`

## Extends

- `EVM`

## Constructors

### new Evm(opts)

> **new Evm**(`opts`?): [`Evm`](/reference/tevm/evm/classes/evm/)

#### Parameters

▪ **opts?**: `EVMOpts`

#### Inherited from

EVM.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

## Properties

### \_block

> **`protected`** **\_block**?: `Block`

#### Inherited from

EVM.\_block

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

***

### \_customOpcodes

> **`protected`** **`readonly`** **\_customOpcodes**?: `CustomOpcode`[]

#### Inherited from

EVM.\_customOpcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

***

### \_customPrecompiles

> **`protected`** **`readonly`** **\_customPrecompiles**?: `CustomPrecompile`[]

#### Inherited from

EVM.\_customPrecompiles

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:38

***

### \_dynamicGasHandlers

> **`protected`** **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

EVM.\_dynamicGasHandlers

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

***

### \_emit

> **`protected`** **`readonly`** **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

#### Parameters

▪ **topic**: `string`

▪ **data**: `any`

#### Inherited from

EVM.\_emit

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:56

***

### \_handlers

> **`protected`** **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

EVM.\_handlers

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

***

### \_opcodeMap

> **`protected`** **\_opcodeMap**: `OpcodeMap`

#### Inherited from

EVM.\_opcodeMap

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

***

### \_opcodes

> **`protected`** **\_opcodes**: `OpcodeList`

#### Inherited from

EVM.\_opcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

***

### \_optsCached

> **`protected`** **`readonly`** **\_optsCached**: `EVMOpts`

#### Inherited from

EVM.\_optsCached

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

***

### \_precompiles

> **`protected`** **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

EVM.\_precompiles

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

***

### \_tx

> **`protected`** **\_tx**?: `object`

#### Type declaration

##### gasPrice

> **gasPrice**: `bigint`

##### origin

> **origin**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVM.\_tx

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

***

### allowUnlimitedContractSize

> **`readonly`** **allowUnlimitedContractSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedContractSize

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

***

### allowUnlimitedInitCodeSize

> **`readonly`** **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedInitCodeSize

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

***

### blockchain

> **blockchain**: `Blockchain`

#### Inherited from

EVM.blockchain

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

***

### common

> **`readonly`** **common**: `Common`

#### Inherited from

EVM.common

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

***

### events

> **`readonly`** **events**: `AsyncEventEmitter`\<`EVMEvents`\>

#### Inherited from

EVM.events

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

***

### journal

> **journal**: `Journal`

#### Inherited from

EVM.journal

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

***

### performanceLogger

> **`protected`** **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

EVM.performanceLogger

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

***

### stateManager

> **stateManager**: [`TevmStateManager`](/reference/tevm/state/type-aliases/tevmstatemanager/)

#### Overrides

EVM.stateManager

#### Source

[packages/evm/src/Evm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L10)

***

### transientStorage

> **`readonly`** **transientStorage**: `TransientStorage`

#### Inherited from

EVM.transientStorage

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

***

### supportedHardforks

> **`protected`** **`static`** **supportedHardforks**: `Hardfork`[]

#### Inherited from

EVM.supportedHardforks

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

> **`get`** **opcodes**(): `OpcodeList`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

***

### precompiles

> **`get`** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance()

> **`protected`** **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

▪ **toAccount**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

▪ **message**: `MessageWithTo`

#### Inherited from

EVM.\_addToBalance

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:92

***

### \_executeCall()

> **`protected`** **\_executeCall**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

▪ **message**: `MessageWithTo`

#### Inherited from

EVM.\_executeCall

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:63

***

### \_executeCreate()

> **`protected`** **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

▪ **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Inherited from

EVM.\_executeCreate

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:64

***

### \_generateAddress()

> **`protected`** **\_generateAddress**(`message`): `Promise`\<[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)\>

#### Parameters

▪ **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Inherited from

EVM.\_generateAddress

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:90

***

### \_loadCode()

> **`protected`** **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

▪ **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Inherited from

EVM.\_loadCode

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

***

### \_reduceSenderBalance()

> **`protected`** **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

▪ **account**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

▪ **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Inherited from

EVM.\_reduceSenderBalance

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:91

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Inherited from

EVM.clearPerformanceLogs

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Inherited from

EVM.getActiveOpcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:62

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

#### Returns

> ##### opcodes
>
> > **opcodes**: `EVMPerformanceLogOutput`[]
>
> ##### precompiles
>
> > **precompiles**: `EVMPerformanceLogOutput`[]
>

#### Inherited from

EVM.getPerformanceLogs

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:107

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVM.getPrecompile

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

▪ **opts**: `EVMRunCallOpts`

#### Inherited from

EVM.runCall

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:74

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

▪ **opts**: `EVMRunCodeOpts`

#### Inherited from

EVM.runCode

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:79

***

### runInterpreter()

> **`protected`** **runInterpreter**(`message`, `opts`?): `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

▪ **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

▪ **opts?**: `InterpreterOpts`

#### Inherited from

EVM.runInterpreter

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:68

***

### runPrecompile()

> **`protected`** **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](/reference/tevm/evm/interfaces/execresult/) \| `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

▪ **code**: `PrecompileFunc`

▪ **data**: `Uint8Array`

▪ **gasLimit**: `bigint`

#### Inherited from

EVM.runPrecompile

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

***

### shallowCopy()

> **shallowCopy**(): `EVM`

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

EVM

#### Inherited from

EVM.shallowCopy

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:106

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
