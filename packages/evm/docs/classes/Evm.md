**@tevm/evm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Evm

# Class: Evm

A wrapper around the EVM to expose some protected functionality of the EVMStateManger
Ideally we find a way to remove this complexity and replace with a normal `action`

## Extends

- `EVM`

## Constructors

### new Evm(opts, bn128)

> **`protected`** **new Evm**(`opts`, `bn128`): [`Evm`](Evm.md)

Creates new EVM object

#### Parameters

▪ **opts**: `EVMOpts`

The EVM options

▪ **bn128**: `bn128`

Initialized bn128 WASM object for precompile usage (internal)

#### Returns

#### Inherited from

EVM.constructor

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async [EVM.create]([object Object]) constructor instead (same API).

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:77

## Properties

### \_block

> **`protected`** **\_block**?: `Block`

#### Inherited from

EVM.\_block

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

***

### \_customOpcodes

> **`protected`** **`readonly`** **\_customOpcodes**?: `CustomOpcode`[]

#### Inherited from

EVM.\_customOpcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

***

### \_customPrecompiles

> **`protected`** **`readonly`** **\_customPrecompiles**?: `CustomPrecompile`[]

#### Inherited from

EVM.\_customPrecompiles

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:38

***

### \_dynamicGasHandlers

> **`protected`** **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

EVM.\_dynamicGasHandlers

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

***

### \_emit

> **`protected`** **`readonly`** **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

#### Parameters

▪ **topic**: `string`

▪ **data**: `any`

#### Inherited from

EVM.\_emit

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:56

***

### \_handlers

> **`protected`** **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

EVM.\_handlers

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

***

### \_opcodeMap

> **`protected`** **\_opcodeMap**: `OpcodeMap`

#### Inherited from

EVM.\_opcodeMap

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

***

### \_opcodes

> **`protected`** **\_opcodes**: `OpcodeList`

#### Inherited from

EVM.\_opcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

***

### \_optsCached

> **`protected`** **`readonly`** **\_optsCached**: `EVMOpts`

#### Inherited from

EVM.\_optsCached

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

***

### \_precompiles

> **`protected`** **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

EVM.\_precompiles

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

***

### \_tx

> **`protected`** **\_tx**?: `object`

#### Type declaration

##### gasPrice

> **gasPrice**: `bigint`

##### origin

> **origin**: `Address`

#### Inherited from

EVM.\_tx

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

***

### allowUnlimitedContractSize

> **`readonly`** **allowUnlimitedContractSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedContractSize

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

***

### allowUnlimitedInitCodeSize

> **`readonly`** **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedInitCodeSize

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

***

### blockchain

> **blockchain**: `Blockchain`

#### Inherited from

EVM.blockchain

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

***

### common

> **`readonly`** **common**: `Common`

#### Inherited from

EVM.common

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

***

### events

> **`readonly`** **events**: `AsyncEventEmitter`\<`EVMEvents`\>

#### Inherited from

EVM.events

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

***

### journal

> **journal**: `Journal`

#### Inherited from

EVM.journal

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

***

### performanceLogger

> **`protected`** **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

EVM.performanceLogger

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

***

### stateManager

> **stateManager**: `TevmStateManager`

#### Overrides

EVM.stateManager

#### Source

[packages/evm/src/Evm.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L16)

***

### transientStorage

> **`readonly`** **transientStorage**: `TransientStorage`

#### Inherited from

EVM.transientStorage

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

***

### create

> **`static`** **create**: (`options`?) => `Promise`\<[`Evm`](Evm.md)\>

#### Parameters

▪ **options?**: `EVMOpts`

#### Overrides

EVM.create

#### Source

[packages/evm/src/Evm.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L15)

***

### supportedHardforks

> **`static`** **`protected`** **supportedHardforks**: `Hardfork`[]

#### Inherited from

EVM.supportedHardforks

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

> **`get`** **opcodes**(): `OpcodeList`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

***

### precompiles

> **`get`** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance()

> **`protected`** **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

▪ **toAccount**: `Account`

▪ **message**: `MessageWithTo`

#### Inherited from

EVM.\_addToBalance

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:112

***

### \_executeCall()

> **`protected`** **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

▪ **message**: `MessageWithTo`

#### Inherited from

EVM.\_executeCall

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

***

### \_executeCreate()

> **`protected`** **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

▪ **message**: [`EthjsMessage`](EthjsMessage.md)

#### Inherited from

EVM.\_executeCreate

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

***

### \_generateAddress()

> **`protected`** **\_generateAddress**(`message`): `Promise`\<`Address`\>

#### Parameters

▪ **message**: [`EthjsMessage`](EthjsMessage.md)

#### Inherited from

EVM.\_generateAddress

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

***

### \_loadCode()

> **`protected`** **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

▪ **message**: [`EthjsMessage`](EthjsMessage.md)

#### Inherited from

EVM.\_loadCode

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:109

***

### \_reduceSenderBalance()

> **`protected`** **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

▪ **account**: `Account`

▪ **message**: [`EthjsMessage`](EthjsMessage.md)

#### Inherited from

EVM.\_reduceSenderBalance

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Inherited from

EVM.clearPerformanceLogs

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:131

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Inherited from

EVM.getActiveOpcodes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:82

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:127

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

▪ **address**: `Address`

#### Inherited from

EVM.getPrecompile

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:104

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

▪ **opts**: [`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md)

#### Inherited from

EVM.runCall

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:94

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

▪ **opts**: `EVMRunCodeOpts`

#### Inherited from

EVM.runCode

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:99

***

### runInterpreter()

> **`protected`** **runInterpreter**(`message`, `opts`?): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

▪ **message**: [`EthjsMessage`](EthjsMessage.md)

▪ **opts?**: `InterpreterOpts`

#### Inherited from

EVM.runInterpreter

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

***

### runPrecompile()

> **`protected`** **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

▪ **code**: `PrecompileFunc`

▪ **data**: `Uint8Array`

▪ **gasLimit**: `bigint`

#### Inherited from

EVM.runPrecompile

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:108

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:126

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
