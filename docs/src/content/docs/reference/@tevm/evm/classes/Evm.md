---
editUrl: false
next: false
prev: false
title: "Evm"
---

The Tevm EVM is in charge of executing bytecode. It is a very light wrapper around ethereumjs EVM
The Evm class provides tevm specific typing with regard to the custom stateManager. It does not
provide custom typing to the blockchain or common objects.

## Example

```typescript
import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
import { mainnet } from 'tevm/common'
import { createStateManager } from 'tevm/state'
import { createBlockchain } from 'tevm/blockchain'}
import { EthjsAddress } from 'tevm/utils'

const evm: Evm = createEvm({
  common: mainnet.copy(),
  stateManager: createStateManager(),
  blockchain: createBlockchain(),
})
```

## See

[createEvm](https://tevm.sh/reference/tevm/evm/functions/createevm/)

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

`EVM.constructor`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:77

## Properties

### \_block?

> `protected` `optional` **\_block**: `Block`

#### Inherited from

`EVM._block`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes**: `CustomOpcode`[]

#### Inherited from

`EVM._customOpcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

***

### \_customPrecompiles

> `protected` **\_customPrecompiles**: `CustomPrecompile`[]

#### Overrides

`EVM._customPrecompiles`

#### Defined in

[packages/evm/src/Evm.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L54)

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

`EVM._dynamicGasHandlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:56

***

### \_handlers

> `protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

`EVM._handlers`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

#### Inherited from

`EVM._opcodeMap`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

#### Inherited from

`EVM._opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

#### Inherited from

`EVM._optsCached`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM._precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

***

### \_tx?

> `protected` `optional` **\_tx**: `object`

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

`EVM._tx`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedContractSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedInitCodeSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

***

### blockchain

> **blockchain**: `Blockchain`

#### Inherited from

`EVM.blockchain`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EVM.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

***

### events

> `readonly` **events**: [`AsyncEventEmitter`](/reference/tevm/utils/classes/asynceventemitter/)\<`EVMEvents`\>

#### Inherited from

`EVM.events`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

***

### journal

> **journal**: `Journal`

#### Inherited from

`EVM.journal`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

`EVM.performanceLogger`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

***

### stateManager

> **stateManager**: `StateManager`

#### Overrides

`EVM.stateManager`

#### Defined in

[packages/evm/src/Evm.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L53)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

#### Inherited from

`EVM.transientStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

***

### create()

> `static` **create**: (`options`?) => `Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

#### Parameters

• **options?**: `EVMOpts`

#### Returns

`Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

A new EVM

#### Overrides

`EVM.create`

#### Defined in

[packages/evm/src/Evm.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L52)

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: `Hardfork`[]

#### Inherited from

`EVM.supportedHardforks`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

> `get` **opcodes**(): `OpcodeList`

#### Returns

`OpcodeList`

#### Inherited from

`EVM.opcodes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

***

### precompiles

> `get` **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM.precompiles`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

• **toAccount**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

• **message**: `MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._addToBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:112

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

• **message**: `MessageWithTo`

#### Returns

`Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Inherited from

`EVM._executeCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<[`EvmResult`](/reference/tevm/evm/interfaces/evmresult/)\>

#### Inherited from

`EVM._executeCreate`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)\>

#### Inherited from

`EVM._generateAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._loadCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:109

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

• **account**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

• **message**: [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._reduceSenderBalance`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

[packages/evm/src/Evm.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L28)

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Returns

`void`

#### Inherited from

`EVM.clearPerformanceLogs`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:131

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:82

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:127

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

`EVM.getPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:104

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

#### Parameters

• **precompile**: `CustomPrecompile`

#### Returns

`void`

#### Defined in

[packages/evm/src/Evm.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L38)

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

`EVM.runCall`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:94

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

`EVM.runCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:99

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

`EVM.runInterpreter`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

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

`EVM.runPrecompile`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:108

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

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:126
