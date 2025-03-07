[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / Evm

# Class: Evm

Defined in: packages/evm/dist/index.d.ts:70

## Extends

- `EVM`

## Constructors

### new Evm()

> `protected` **new Evm**(`opts`, `bn128`): [`Evm`](Evm.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:78

Creates new EVM object

#### Parameters

##### opts

`EVMOpts`

The EVM options

##### bn128

`bn128`

Initialized bn128 WASM object for precompile usage (internal)

#### Returns

[`Evm`](Evm.md)

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async EVM.create constructor instead (same API).

#### Inherited from

`EVM.constructor`

## Properties

### \_block?

> `protected` `optional` **\_block**: `Block`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

#### Inherited from

`EVM._block`

***

### \_bls?

> `protected` `readonly` `optional` **\_bls**: `EVMBLSInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:47

#### Inherited from

`EVM._bls`

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes**: `CustomOpcode`[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

#### Inherited from

`EVM._customOpcodes`

***

### \_customPrecompiles

> `protected` **\_customPrecompiles**: `CustomPrecompile`[]

Defined in: packages/evm/dist/index.d.ts:72

#### Overrides

`EVM._customPrecompiles`

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

#### Inherited from

`EVM._dynamicGasHandlers`

***

### \_emit()

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

#### Parameters

##### topic

`string`

##### data

`any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._emit`

***

### \_handlers

> `protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

#### Inherited from

`EVM._handlers`

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

#### Inherited from

`EVM._opcodeMap`

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

#### Inherited from

`EVM._opcodes`

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

#### Inherited from

`EVM._optsCached`

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

#### Inherited from

`EVM._precompiles`

***

### \_tx?

> `protected` `optional` **\_tx**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EVM._tx`

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

#### Inherited from

`EVM.allowUnlimitedContractSize`

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

#### Inherited from

`EVM.allowUnlimitedInitCodeSize`

***

### blockchain

> **blockchain**: `Blockchain`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

#### Inherited from

`EVM.blockchain`

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

#### Inherited from

`EVM.common`

***

### events

> `readonly` **events**: [`AsyncEventEmitter`](../../utils/classes/AsyncEventEmitter.md)\<`EVMEvents`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

#### Inherited from

`EVM.events`

***

### journal

> **journal**: `Journal`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

#### Inherited from

`EVM.journal`

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

#### Inherited from

`EVM.performanceLogger`

***

### stateManager

> **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)

Defined in: packages/evm/dist/index.d.ts:71

#### Overrides

`EVM.stateManager`

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

#### Inherited from

`EVM.transientStorage`

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: `Hardfork`[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

#### Inherited from

`EVM.supportedHardforks`

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

##### Returns

`OpcodeList`

#### Inherited from

`EVM.opcodes`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

##### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM.precompiles`

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:113

#### Parameters

##### toAccount

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

##### message

`MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._addToBalance`

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

#### Parameters

##### message

`MessageWithTo`

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCall`

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:85

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCreate`

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<[`EthjsAddress`](../../utils/classes/EthjsAddress.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EthjsAddress`](../../utils/classes/EthjsAddress.md)\>

#### Inherited from

`EVM._generateAddress`

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._loadCode`

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:112

#### Parameters

##### account

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._reduceSenderBalance`

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

Defined in: packages/evm/dist/index.d.ts:73

#### Parameters

##### precompile

`CustomPrecompile`

#### Returns

`void`

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:132

#### Returns

`void`

#### Inherited from

`EVM.clearPerformanceLogs`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EVM.getActiveOpcodes`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:128

#### Returns

`object`

##### opcodes

> **opcodes**: `EVMPerformanceLogOutput`[]

##### precompiles

> **precompiles**: `EVMPerformanceLogOutput`[]

#### Inherited from

`EVM.getPerformanceLogs`

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:105

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `PrecompileFunc`

#### Inherited from

`EVM.getPrecompile`

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

Defined in: packages/evm/dist/index.d.ts:74

#### Parameters

##### precompile

`CustomPrecompile`

#### Returns

`void`

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:95

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

##### opts

[`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM.runCall`

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:100

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

##### opts

`EVMRunCodeOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runCode`

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts`?): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

##### opts?

`InterpreterOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runInterpreter`

***

### runPrecompile()

> `protected` **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:109

Executes a precompiled contract with given data and gas limit.

#### Parameters

##### code

`PrecompileFunc`

##### data

`Uint8Array`

##### gasLimit

`bigint`

#### Returns

[`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runPrecompile`

***

### shallowCopy()

> **shallowCopy**(): `EVM`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:127

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM

#### Inherited from

`EVM.shallowCopy`

***

### create()

> `static` **create**(`options`?): `Promise`\<[`Evm`](Evm.md)\>

Defined in: packages/evm/dist/index.d.ts:75

Use this async static constructor for the initialization
of an EVM object

#### Parameters

##### options?

`EVMOpts`

#### Returns

`Promise`\<[`Evm`](Evm.md)\>

A new EVM

#### Overrides

`EVM.create`
