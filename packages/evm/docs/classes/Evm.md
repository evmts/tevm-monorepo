[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / Evm

# Class: Evm

Defined in: [packages/evm/src/Evm.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.js#L24)

The Tevm EVM is in charge of executing bytecode. It is a light wrapper around ZEVM EVM primitives
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

##### opts

`EVMOpts`

The EVM options

#### Returns

`Evm`

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async createEVM constructor instead (same API).

#### Inherited from

`EVM.constructor`

## Properties

### \_block?

> `protected` `optional` **\_block?**: `Block`

#### Inherited from

`EVM._block`

***

### \_bls?

> `protected` `readonly` `optional` **\_bls?**: `EVMBLSInterface`

#### Inherited from

`EVM._bls`

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes?**: `CustomOpcode`[]

#### Inherited from

`EVM._customOpcodes`

***

### \_customPrecompiles?

> `protected` `readonly` `optional` **\_customPrecompiles?**: `CustomPrecompile`[]

#### Inherited from

`EVM._customPrecompiles`

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

#### Inherited from

`EVM._dynamicGasHandlers`

***

### \_emit

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

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

#### Inherited from

`EVM._handlers`

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

#### Inherited from

`EVM._opcodeMap`

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

#### Inherited from

`EVM._opcodes`

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

#### Inherited from

`EVM._optsCached`

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM._precompiles`

***

### \_tx?

> `protected` `optional` **\_tx?**: `object`

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: `Address`

#### Inherited from

`EVM._tx`

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedContractSize`

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

#### Inherited from

`EVM.allowUnlimitedInitCodeSize`

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness?**: `BinaryTreeAccessWitness`

#### Inherited from

`EVM.binaryAccessWitness`

***

### blockchain

> **blockchain**: `EVMMockBlockchainInterface`

#### Inherited from

`EVM.blockchain`

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EVM.common`

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

#### Inherited from

`EVM.events`

***

### journal

> **journal**: `Journal`

#### Inherited from

`EVM.journal`

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

#### Inherited from

`EVM.performanceLogger`

***

### stateManager

> **stateManager**: `StateManagerInterface`

#### Inherited from

`EVM.stateManager`

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness?**: `BinaryTreeAccessWitness`

#### Inherited from

`EVM.systemBinaryAccessWitness`

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

#### Inherited from

`EVM.transientStorage`

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: (`"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeNetsplitBlock"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"` \| `"bpo1"` \| `"bpo2"` \| `"bpo3"` \| `"bpo4"` \| `"bpo5"` \| `"amsterdam"`)[]

#### Inherited from

`EVM.supportedHardforks`

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

##### toAccount

`Account`

##### message

`MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._addToBalance`

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

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

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EVM._executeCreate`

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<`Address`\>

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`Address`\>

#### Inherited from

`EVM._generateAddress`

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

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

#### Parameters

##### account

`Account`

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EVM._reduceSenderBalance`

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

Defined in: [packages/evm/src/Evm.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.js#L30)

Adds a custom precompile to the EVM.

#### Parameters

##### precompile

`CustomPrecompile`

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

##### address

`Address`

#### Returns

`PrecompileFunc` \| `undefined`

#### Inherited from

`EVM.getPrecompile`

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

Defined in: [packages/evm/src/Evm.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.js#L46)

Removes a custom precompile from the EVM.

#### Parameters

##### precompile

`CustomPrecompile`

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

##### opts

[`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md)

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

##### opts

`EVMRunCodeOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EVM.runCode`

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts?`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

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

Defined in: [packages/evm/src/Evm.js:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/Evm.js#L64)

#### Parameters

##### options?

`EVMOpts`

#### Returns

`Promise`\<[`EvmType`](../type-aliases/EvmType.md)\>
