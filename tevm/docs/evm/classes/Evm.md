[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / Evm

# Class: Evm

Defined in: tevm-monorepo/packages/evm/dist/index.d.ts:217

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:111

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:66

#### Inherited from

`EVM._block`

***

### \_bls?

> `protected` `readonly` `optional` **\_bls?**: `EVMBLSInterface`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

#### Inherited from

`EVM._bls`

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes?**: `CustomOpcode`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:78

#### Inherited from

`EVM._customOpcodes`

***

### \_customPrecompiles?

> `protected` `readonly` `optional` **\_customPrecompiles?**: `CustomPrecompile`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:79

#### Inherited from

`EVM._customPrecompiles`

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:81

#### Inherited from

`EVM._dynamicGasHandlers`

***

### \_emit

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:98

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:80

#### Inherited from

`EVM._handlers`

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:82

#### Inherited from

`EVM._opcodeMap`

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:75

#### Inherited from

`EVM._opcodes`

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:84

#### Inherited from

`EVM._optsCached`

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

#### Inherited from

`EVM._precompiles`

***

### \_tx?

> `protected` `optional` **\_tx?**: `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:62

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: `Address`

#### Inherited from

`EVM._tx`

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:76

#### Inherited from

`EVM.allowUnlimitedContractSize`

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:77

#### Inherited from

`EVM.allowUnlimitedInitCodeSize`

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness?**: `BinaryTreeAccessWitness`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:72

#### Inherited from

`EVM.binaryAccessWitness`

***

### blockchain

> **blockchain**: `EVMMockBlockchainInterface`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:70

#### Inherited from

`EVM.blockchain`

***

### common

> `readonly` **common**: `Common`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:67

#### Inherited from

`EVM.common`

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:68

#### Inherited from

`EVM.events`

***

### journal

> **journal**: `Journal`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:71

#### Inherited from

`EVM.journal`

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:85

#### Inherited from

`EVM.performanceLogger`

***

### stateManager

> **stateManager**: [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:69

#### Inherited from

`EVM.stateManager`

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness?**: `BinaryTreeAccessWitness`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:73

#### Inherited from

`EVM.systemBinaryAccessWitness`

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:74

#### Inherited from

`EVM.transientStorage`

***

### create

> `static` **create**: (`options?`) => `Promise`\<[`EvmType`](../type-aliases/EvmType.md)\>

Defined in: tevm-monorepo/packages/evm/dist/index.d.ts:222

#### Parameters

##### options?

`EVMOpts`

#### Returns

`Promise`\<[`EvmType`](../type-aliases/EvmType.md)\>

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: (`"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"` \| `"mergeNetsplitBlock"` \| `"bpo1"` \| `"bpo2"` \| `"bpo3"` \| `"bpo4"` \| `"bpo5"` \| `"amsterdam"`)[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:61

#### Inherited from

`EVM.supportedHardforks`

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:87

##### Returns

`OpcodeList`

#### Inherited from

`EVM.opcodes`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:86

##### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EVM.precompiles`

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:146

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:117

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:118

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:144

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:143

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:145

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

Defined in: tevm-monorepo/packages/evm/dist/index.d.ts:228

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:165

#### Returns

`void`

#### Inherited from

`EVM.clearPerformanceLogs`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:116

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EVM.getActiveOpcodes`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:161

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:138

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

Defined in: tevm-monorepo/packages/evm/dist/index.d.ts:235

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:128

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:133

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:122

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:142

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:160

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM

#### Inherited from

`EVM.shallowCopy`
