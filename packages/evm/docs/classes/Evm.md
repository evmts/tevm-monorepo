[@tevm/evm](../README.md) / [Exports](../modules.md) / Evm

# Class: Evm

A wrapper around the EVM to expose some protected functionality of the EVMStateManger
Ideally we find a way to remove this complexity and replace with a normal `action`

## Hierarchy

- `EVM`

  ↳ **`Evm`**

## Table of contents

### Constructors

- [constructor](Evm.md#constructor)

### Properties

- [\_block](Evm.md#_block)
- [\_customOpcodes](Evm.md#_customopcodes)
- [\_customPrecompiles](Evm.md#_customprecompiles)
- [\_dynamicGasHandlers](Evm.md#_dynamicgashandlers)
- [\_emit](Evm.md#_emit)
- [\_handlers](Evm.md#_handlers)
- [\_opcodeMap](Evm.md#_opcodemap)
- [\_opcodes](Evm.md#_opcodes)
- [\_optsCached](Evm.md#_optscached)
- [\_precompiles](Evm.md#_precompiles)
- [\_tx](Evm.md#_tx)
- [allowUnlimitedContractSize](Evm.md#allowunlimitedcontractsize)
- [allowUnlimitedInitCodeSize](Evm.md#allowunlimitedinitcodesize)
- [blockchain](Evm.md#blockchain)
- [common](Evm.md#common)
- [events](Evm.md#events)
- [journal](Evm.md#journal)
- [performanceLogger](Evm.md#performancelogger)
- [stateManager](Evm.md#statemanager)
- [transientStorage](Evm.md#transientstorage)
- [supportedHardforks](Evm.md#supportedhardforks)

### Accessors

- [opcodes](Evm.md#opcodes)
- [precompiles](Evm.md#precompiles)

### Methods

- [\_addToBalance](Evm.md#_addtobalance)
- [\_executeCall](Evm.md#_executecall)
- [\_executeCreate](Evm.md#_executecreate)
- [\_generateAddress](Evm.md#_generateaddress)
- [\_loadCode](Evm.md#_loadcode)
- [\_reduceSenderBalance](Evm.md#_reducesenderbalance)
- [clearPerformanceLogs](Evm.md#clearperformancelogs)
- [getActiveOpcodes](Evm.md#getactiveopcodes)
- [getPerformanceLogs](Evm.md#getperformancelogs)
- [getPrecompile](Evm.md#getprecompile)
- [runCall](Evm.md#runcall)
- [runCode](Evm.md#runcode)
- [runInterpreter](Evm.md#runinterpreter)
- [runPrecompile](Evm.md#runprecompile)
- [shallowCopy](Evm.md#shallowcopy)

## Constructors

### constructor

• **new Evm**(`opts?`): [`Evm`](Evm.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `EVMOpts` |

#### Returns

[`Evm`](Evm.md)

#### Inherited from

EVM.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

## Properties

### \_block

• `Protected` `Optional` **\_block**: `Block`

#### Inherited from

EVM.\_block

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:27

___

### \_customOpcodes

• `Protected` `Optional` `Readonly` **\_customOpcodes**: `CustomOpcode`[]

#### Inherited from

EVM.\_customOpcodes

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

___

### \_customPrecompiles

• `Protected` `Optional` `Readonly` **\_customPrecompiles**: `CustomPrecompile`[]

#### Inherited from

EVM.\_customPrecompiles

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:38

___

### \_dynamicGasHandlers

• `Protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

EVM.\_dynamicGasHandlers

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

___

### \_emit

• `Protected` `Readonly` **\_emit**: (`topic`: `string`, `data`: `any`) => `Promise`\<`void`\>

#### Type declaration

▸ (`topic`, `data`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `string` |
| `data` | `any` |

##### Returns

`Promise`\<`void`\>

#### Inherited from

EVM.\_emit

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:56

___

### \_handlers

• `Protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

#### Inherited from

EVM.\_handlers

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:39

___

### \_opcodeMap

• `Protected` **\_opcodeMap**: `OpcodeMap`

#### Inherited from

EVM.\_opcodeMap

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

___

### \_opcodes

• `Protected` **\_opcodes**: `OpcodeList`

#### Inherited from

EVM.\_opcodes

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:34

___

### \_optsCached

• `Protected` `Readonly` **\_optsCached**: `EVMOpts`

#### Inherited from

EVM.\_optsCached

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

___

### \_precompiles

• `Protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

EVM.\_precompiles

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

___

### \_tx

• `Protected` `Optional` **\_tx**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gasPrice` | `bigint` |
| `origin` | `Address` |

#### Inherited from

EVM.\_tx

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:23

___

### allowUnlimitedContractSize

• `Readonly` **allowUnlimitedContractSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedContractSize

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:35

___

### allowUnlimitedInitCodeSize

• `Readonly` **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

EVM.allowUnlimitedInitCodeSize

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

___

### blockchain

• **blockchain**: `Blockchain`

#### Inherited from

EVM.blockchain

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

EVM.common

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:28

___

### events

• `Readonly` **events**: `AsyncEventEmitter`\<`EVMEvents`\>

#### Inherited from

EVM.events

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:29

___

### journal

• **journal**: `Journal`

#### Inherited from

EVM.journal

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

___

### performanceLogger

• `Protected` **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

EVM.performanceLogger

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

___

### stateManager

• **stateManager**: `TevmStateManager`

#### Overrides

EVM.stateManager

#### Defined in

[packages/evm/src/Evm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.ts#L10)

___

### transientStorage

• `Readonly` **transientStorage**: `TransientStorage`

#### Inherited from

EVM.transientStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:33

___

### supportedHardforks

▪ `Static` `Protected` **supportedHardforks**: `Hardfork`[]

#### Inherited from

EVM.supportedHardforks

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:22

## Accessors

### opcodes

• `get` **opcodes**(): `OpcodeList`

#### Returns

`OpcodeList`

#### Inherited from

EVM.opcodes

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

___

### precompiles

• `get` **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

#### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

EVM.precompiles

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

## Methods

### \_addToBalance

▸ **_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `toAccount` | `Account` |
| `message` | `MessageWithTo` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVM.\_addToBalance

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:92

___

### \_executeCall

▸ **_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `MessageWithTo` |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

EVM.\_executeCall

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:63

___

### \_executeCreate

▸ **_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

EVM.\_executeCreate

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:64

___

### \_generateAddress

▸ **_generateAddress**(`message`): `Promise`\<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`Address`\>

#### Inherited from

EVM.\_generateAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:90

___

### \_loadCode

▸ **_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVM.\_loadCode

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

___

### \_reduceSenderBalance

▸ **_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `Account` |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVM.\_reduceSenderBalance

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:91

___

### clearPerformanceLogs

▸ **clearPerformanceLogs**(): `void`

#### Returns

`void`

#### Inherited from

EVM.clearPerformanceLogs

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

___

### getActiveOpcodes

▸ **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

EVM.getActiveOpcodes

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:62

___

### getPerformanceLogs

▸ **getPerformanceLogs**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `opcodes` | `EVMPerformanceLogOutput`[] |
| `precompiles` | `EVMPerformanceLogOutput`[] |

#### Inherited from

EVM.getPerformanceLogs

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:107

___

### getPrecompile

▸ **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`undefined` \| `PrecompileFunc`

#### Inherited from

EVM.getPrecompile

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

___

### runCall

▸ **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `EVMRunCallOpts` |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

EVM.runCall

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:74

___

### runCode

▸ **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `EVMRunCodeOpts` |

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

EVM.runCode

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:79

___

### runInterpreter

▸ **runInterpreter**(`message`, `opts?`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |
| `opts?` | `InterpreterOpts` |

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

EVM.runInterpreter

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:68

___

### runPrecompile

▸ **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `PrecompileFunc` |
| `data` | `Uint8Array` |
| `gasLimit` | `bigint` |

#### Returns

[`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

EVM.runPrecompile

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

___

### shallowCopy

▸ **shallowCopy**(): `EVM`

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM

#### Inherited from

EVM.shallowCopy

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/evm.d.ts:106
