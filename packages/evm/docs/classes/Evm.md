[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / Evm

# Class: Evm

The Tevm EVM is in charge of executing bytecode. It is a light wrapper around ZEVM EVM primitives.
The Evm class provides tevm specific typing with regard to the custom stateManager. It does not
provide custom typing to the blockchain or common objects.

## Example

```typescript
import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
import { mainnet } from 'tevm/common'
import { createStateManager } from 'tevm/state'
import { createBlockchain } from 'tevm/blockchain'}
import { EthjsAddress } from 'tevm/utils'

const evm = createEvm({
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

### Constructor

> **new Evm**(`opts`): `Evm`

Creates new EVM object

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `EVMOpts` | The EVM options |

#### Returns

`Evm`

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async createEVM constructor instead (same API).

#### Inherited from

`EVM.constructor`

## Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="_block"></a> `_block?` | `protected` | `Block` | `EVM._block` |
| <a id="_bls"></a> `_bls?` | `readonly` | `EVMBLSInterface` | `EVM._bls` |
| <a id="_customopcodes"></a> `_customOpcodes?` | `readonly` | `CustomOpcode`[] | `EVM._customOpcodes` |
| <a id="_customprecompiles"></a> `_customPrecompiles?` | `readonly` | `CustomPrecompile`[] | `EVM._customPrecompiles` |
| <a id="_dynamicgashandlers"></a> `_dynamicGasHandlers` | `protected` | `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\> | `EVM._dynamicGasHandlers` |
| <a id="_emit"></a> `_emit` | `readonly` | (`topic`, `data`) => `Promise`\<`void`\> | `EVM._emit` |
| <a id="_handlers"></a> `_handlers` | `protected` | `Map`\<`number`, `OpHandler`\> | `EVM._handlers` |
| <a id="_opcodemap"></a> `_opcodeMap` | `protected` | `OpcodeMap` | `EVM._opcodeMap` |
| <a id="_opcodes"></a> `_opcodes` | `protected` | `OpcodeList` | `EVM._opcodes` |
| <a id="_optscached"></a> `_optsCached` | `readonly` | `EVMOpts` | `EVM._optsCached` |
| <a id="_precompiles"></a> `_precompiles` | `protected` | `Map`\<`string`, `PrecompileFunc`\> | `EVM._precompiles` |
| <a id="_tx"></a> `_tx?` | `protected` | `object` | `EVM._tx` |
| `_tx.gasPrice` | `public` | `bigint` | - |
| `_tx.origin` | `public` | `Address` | - |
| <a id="allowunlimitedcontractsize"></a> `allowUnlimitedContractSize` | `readonly` | `boolean` | `EVM.allowUnlimitedContractSize` |
| <a id="allowunlimitedinitcodesize"></a> `allowUnlimitedInitCodeSize` | `readonly` | `boolean` | `EVM.allowUnlimitedInitCodeSize` |
| <a id="binaryaccesswitness"></a> `binaryAccessWitness?` | `public` | `BinaryTreeAccessWitness` | `EVM.binaryAccessWitness` |
| <a id="blockchain"></a> `blockchain` | `public` | `EVMMockBlockchainInterface` | `EVM.blockchain` |
| <a id="common"></a> `common` | `readonly` | `Common` | `EVM.common` |
| <a id="events"></a> `events` | `readonly` | `EventEmitter`\<`EVMEvent`\> | `EVM.events` |
| <a id="journal"></a> `journal` | `public` | `Journal` | `EVM.journal` |
| <a id="performancelogger"></a> `performanceLogger` | `protected` | `EVMPerformanceLogger` | `EVM.performanceLogger` |
| <a id="statemanager"></a> `stateManager` | `public` | `StateManagerInterface` | `EVM.stateManager` |
| <a id="systembinaryaccesswitness"></a> `systemBinaryAccessWitness?` | `public` | `BinaryTreeAccessWitness` | `EVM.systemBinaryAccessWitness` |
| <a id="transientstorage"></a> `transientStorage` | `readonly` | `TransientStorage` | `EVM.transientStorage` |
| <a id="supportedhardforks"></a> `supportedHardforks` | `static` | (`"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeNetsplitBlock"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"` \| `"bpo1"` \| `"bpo2"` \| `"bpo3"` \| `"bpo4"` \| `"bpo5"` \| `"amsterdam"`)[] | `EVM.supportedHardforks` |

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

##### Returns

`OpcodeList`

#### Inherited from

`EVM.opcodes`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

##### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM.precompiles`

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `toAccount` | `Account` |
| `message` | `MessageWithTo` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._addToBalance`

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `MessageWithTo` |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCall`

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCreate`

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<`Address`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`Address`\>

#### Inherited from

`EVM._generateAddress`

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._loadCode`

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `account` | `Account` |
| `message` | [`EthjsMessage`](EthjsMessage.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._reduceSenderBalance`

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

Adds a custom precompile to the EVM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `precompile` | `CustomPrecompile` | - |

#### Returns

`void`

#### Throws

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

#### Returns

`void`

#### Inherited from

`EVM.clearPerformanceLogs`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EVM.getActiveOpcodes`

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

***

### getPrecompile()

> **getPrecompile**(`address`): `PrecompileFunc` \| `undefined`

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`PrecompileFunc` \| `undefined`

#### Inherited from

`EVM.getPrecompile`

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

Removes a custom precompile from the EVM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `precompile` | `CustomPrecompile` | - |

#### Returns

`void`

#### Throws

#### Throws

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md) |

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM.runCall`

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `EVMRunCodeOpts` |

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runCode`

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts?`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`EthjsMessage`](EthjsMessage.md) |
| `opts?` | `InterpreterOpts` |

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runInterpreter`

***

### runPrecompile()

> `protected` **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Executes a precompiled contract with given data and gas limit.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `PrecompileFunc` |
| `data` | `Uint8Array` |
| `gasLimit` | `bigint` |

#### Returns

[`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runPrecompile`

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

***

### create()

> `static` **create**(`options?`): `Promise`\<[`EvmType`](../type-aliases/EvmType.md)\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `EVMOpts` | - |

#### Returns

`Promise`\<[`EvmType`](../type-aliases/EvmType.md)\>
