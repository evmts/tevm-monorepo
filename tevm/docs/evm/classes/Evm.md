[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [evm](../README.md) / Evm

# Class: Evm

## Extends

- `EVM`

## Constructors

### new Evm()

> `protected` **new Evm**(`opts`, `bn128`): [`Evm`](Evm.md)

Creates new EVM object

#### Parameters

• **opts**: `EVMOpts`

The EVM options

• **bn128**: `bn128`

Initialized bn128 WASM object for precompile usage (internal)

#### Returns

[`Evm`](Evm.md)

#### Inherited from

`EVM.constructor`

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async EVM.create constructor instead (same API).

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:78

## Properties

### \_block?

> `protected` `optional` **\_block**: `Block`

#### Inherited from

`EVM._block`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

***

### \_bls?

> `protected` `readonly` `optional` **\_bls**: `EVMBLSInterface`

#### Inherited from

`EVM._bls`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:47

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes**: `CustomOpcode`[]

#### Inherited from

`EVM._customOpcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

***

### \_customPrecompiles

> `protected` **\_customPrecompiles**: `CustomPrecompile`[]

#### Overrides

`EVM._customPrecompiles`

#### Defined in

packages/evm/dist/index.d.ts:72

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

`EVM._dynamicGasHandlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

***

### \_emit()

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **data**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._emit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

***

### \_handlers

> `protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

`EVM._handlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

#### Inherited from

`EVM._opcodeMap`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

#### Inherited from

`EVM._opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

#### Inherited from

`EVM._optsCached`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM._precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

***

### \_tx?

> `protected` `optional` **\_tx**: `object`

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EVM._tx`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedContractSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedInitCodeSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

***

### blockchain

> **blockchain**: `Blockchain`

#### Inherited from

`EVM.blockchain`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EVM.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

***

### events

> `readonly` **events**: [`AsyncEventEmitter`](../../utils/classes/AsyncEventEmitter.md)\<`EVMEvents`\>

#### Inherited from

`EVM.events`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

***

### journal

> **journal**: `Journal`

#### Inherited from

`EVM.journal`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

`EVM.performanceLogger`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

***

### stateManager

> **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)

#### Overrides

`EVM.stateManager`

#### Defined in

packages/evm/dist/index.d.ts:71

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

#### Inherited from

`EVM.transientStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: `Hardfork`[]

#### Inherited from

`EVM.supportedHardforks`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

> `get` **opcodes**(): `OpcodeList`

#### Returns

`OpcodeList`

#### Inherited from

`EVM.opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

***

### precompiles

> `get` **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM.precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

• **toAccount**: [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

• **message**: `MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._addToBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:113

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

• **message**: `MessageWithTo`

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

• **message**: [`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCreate`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:85

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<[`EthjsAddress`](../../utils/classes/EthjsAddress.md)\>

#### Parameters

• **message**: [`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EthjsAddress`](../../utils/classes/EthjsAddress.md)\>

#### Inherited from

`EVM._generateAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

• **message**: [`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._loadCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

• **account**: [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

• **message**: [`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._reduceSenderBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:112

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

packages/evm/dist/index.d.ts:73

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Returns

`void`

#### Inherited from

`EVM.clearPerformanceLogs`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:132

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EVM.getActiveOpcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

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

`EVM.getPerformanceLogs`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:128

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `PrecompileFunc`

#### Inherited from

`EVM.getPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:105

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

packages/evm/dist/index.d.ts:74

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

• **opts**: [`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM.runCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:95

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

• **opts**: `EVMRunCodeOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:100

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts`?): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

• **message**: [`EthjsMessage`](EthjsMessage.md)

• **opts?**: `InterpreterOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runInterpreter`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

***

### runPrecompile()

> `protected` **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

• **code**: `PrecompileFunc`

• **data**: `Uint8Array`

• **gasLimit**: `bigint`

#### Returns

[`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:109

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

`EVM.shallowCopy`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:127

***

### create()

> `static` **create**(`options`?): `Promise`\<[`Evm`](Evm.md)\>

Use this async static constructor for the initialization
of an EVM object

#### Parameters

• **options?**: `EVMOpts`

#### Returns

`Promise`\<[`Evm`](Evm.md)\>

A new EVM

#### Overrides

`EVM.create`

#### Defined in

packages/evm/dist/index.d.ts:75
