[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EvmType

# Class: EvmType

Defined in: [packages/evm/src/EvmType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L12)

## Extends

- `EVM`

## Constructors

### Constructor

> **new EvmType**(`opts`): `Evm`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:83

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

`EthereumEVM.constructor`

## Properties

### \_block?

> `protected` `optional` **\_block**: `Block`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:36

#### Inherited from

`EthereumEVM._block`

***

### \_bls?

> `protected` `readonly` `optional` **\_bls**: `EVMBLSInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:60

#### Inherited from

`EthereumEVM._bls`

***

### \_customOpcodes?

> `protected` `readonly` `optional` **\_customOpcodes**: `CustomOpcode`[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:50

#### Inherited from

`EthereumEVM._customOpcodes`

***

### \_customPrecompiles

> `protected` **\_customPrecompiles**: `CustomPrecompile`[]

Defined in: [packages/evm/src/EvmType.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L14)

#### Overrides

`EthereumEVM._customPrecompiles`

***

### \_dynamicGasHandlers

> `protected` **\_dynamicGasHandlers**: `Map`\<`number`, `AsyncDynamicGasHandler` \| `SyncDynamicGasHandler`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:53

#### Inherited from

`EthereumEVM._dynamicGasHandlers`

***

### \_emit()

> `protected` `readonly` **\_emit**: (`topic`, `data`) => `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:70

#### Parameters

##### topic

`string`

##### data

`any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._emit`

***

### \_handlers

> `protected` **\_handlers**: `Map`\<`number`, `OpHandler`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:52

#### Inherited from

`EthereumEVM._handlers`

***

### \_opcodeMap

> `protected` **\_opcodeMap**: `OpcodeMap`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:54

#### Inherited from

`EthereumEVM._opcodeMap`

***

### \_opcodes

> `protected` **\_opcodes**: `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:47

#### Inherited from

`EthereumEVM._opcodes`

***

### \_optsCached

> `protected` `readonly` **\_optsCached**: `EVMOpts`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:56

#### Inherited from

`EthereumEVM._optsCached`

***

### \_precompiles

> `protected` **\_precompiles**: `Map`\<`string`, `PrecompileFunc`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:55

#### Inherited from

`EthereumEVM._precompiles`

***

### \_tx?

> `protected` `optional` **\_tx**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:32

#### gasPrice

> **gasPrice**: `bigint`

#### origin

> **origin**: `Address`

#### Inherited from

`EthereumEVM._tx`

***

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:48

#### Inherited from

`EthereumEVM.allowUnlimitedContractSize`

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:49

#### Inherited from

`EthereumEVM.allowUnlimitedInitCodeSize`

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness**: `BinaryTreeAccessWitness`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:44

#### Inherited from

`EthereumEVM.binaryAccessWitness`

***

### blockchain

> **blockchain**: `EVMMockBlockchainInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:40

#### Inherited from

`EthereumEVM.blockchain`

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:37

#### Inherited from

`EthereumEVM.common`

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:38

#### Inherited from

`EthereumEVM.events`

***

### journal

> **journal**: `Journal`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:41

#### Inherited from

`EthereumEVM.journal`

***

### performanceLogger

> `protected` **performanceLogger**: `EVMPerformanceLogger`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:57

#### Inherited from

`EthereumEVM.performanceLogger`

***

### stateManager

> **stateManager**: `StateManager`

Defined in: [packages/evm/src/EvmType.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L13)

#### Overrides

`EthereumEVM.stateManager`

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness**: `BinaryTreeAccessWitness`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:45

#### Inherited from

`EthereumEVM.systemBinaryAccessWitness`

***

### systemVerkleAccessWitness?

> `optional` **systemVerkleAccessWitness**: `VerkleAccessWitness`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:43

#### Inherited from

`EthereumEVM.systemVerkleAccessWitness`

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:46

#### Inherited from

`EthereumEVM.transientStorage`

***

### verkleAccessWitness?

> `optional` **verkleAccessWitness**: `VerkleAccessWitness`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:42

#### Inherited from

`EthereumEVM.verkleAccessWitness`

***

### supportedHardforks

> `protected` `static` **supportedHardforks**: (`"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeNetsplitBlock"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"` \| `"verkle"`)[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:31

#### Inherited from

`EthereumEVM.supportedHardforks`

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:59

##### Returns

`OpcodeList`

#### Inherited from

`EthereumEVM.opcodes`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:58

##### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Inherited from

`EthereumEVM.precompiles`

## Methods

### \_addToBalance()

> `protected` **\_addToBalance**(`toAccount`, `message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:118

#### Parameters

##### toAccount

`Account`

##### message

`MessageWithTo`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._addToBalance`

***

### \_executeCall()

> `protected` **\_executeCall**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:89

#### Parameters

##### message

`MessageWithTo`

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EthereumEVM._executeCall`

***

### \_executeCreate()

> `protected` **\_executeCreate**(`message`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:90

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EthereumEVM._executeCreate`

***

### \_generateAddress()

> `protected` **\_generateAddress**(`message`): `Promise`\<`Address`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:116

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`Address`\>

#### Inherited from

`EthereumEVM._generateAddress`

***

### \_loadCode()

> `protected` **\_loadCode**(`message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:115

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._loadCode`

***

### \_reduceSenderBalance()

> `protected` **\_reduceSenderBalance**(`account`, `message`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:117

#### Parameters

##### account

`Account`

##### message

[`EthjsMessage`](EthjsMessage.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EthereumEVM._reduceSenderBalance`

***

### addCustomPrecompile()

> **addCustomPrecompile**(`precompile`): `void`

Defined in: [packages/evm/src/EvmType.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L16)

#### Parameters

##### precompile

`CustomPrecompile`

#### Returns

`void`

***

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:137

#### Returns

`void`

#### Inherited from

`EthereumEVM.clearPerformanceLogs`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:88

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

#### Inherited from

`EthereumEVM.getActiveOpcodes`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:133

#### Returns

`object`

##### opcodes

> **opcodes**: `EVMPerformanceLogOutput`[]

##### precompiles

> **precompiles**: `EVMPerformanceLogOutput`[]

#### Inherited from

`EthereumEVM.getPerformanceLogs`

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:110

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

##### address

`Address`

#### Returns

`undefined` \| `PrecompileFunc`

#### Inherited from

`EthereumEVM.getPrecompile`

***

### removeCustomPrecompile()

> **removeCustomPrecompile**(`precompile`): `void`

Defined in: [packages/evm/src/EvmType.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L17)

#### Parameters

##### precompile

`CustomPrecompile`

#### Returns

`void`

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:100

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

##### opts

[`EvmRunCallOpts`](../interfaces/EvmRunCallOpts.md)

#### Returns

`Promise`\<[`EvmResult`](../interfaces/EvmResult.md)\>

#### Inherited from

`EthereumEVM.runCall`

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:105

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

##### opts

`EVMRunCodeOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EthereumEVM.runCode`

***

### runInterpreter()

> `protected` **runInterpreter**(`message`, `opts?`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:94

Starts the actual bytecode processing for a CALL or CREATE

#### Parameters

##### message

[`EthjsMessage`](EthjsMessage.md)

##### opts?

`InterpreterOpts`

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Inherited from

`EthereumEVM.runInterpreter`

***

### runPrecompile()

> `protected` **runPrecompile**(`code`, `data`, `gasLimit`): [`ExecResult`](../interfaces/ExecResult.md) \| `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:114

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

`EthereumEVM.runPrecompile`

***

### shallowCopy()

> **shallowCopy**(): `EVM`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/evm.d.ts:132

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM

#### Inherited from

`EthereumEVM.shallowCopy`

***

### create()

> `static` **create**(`options?`): `Promise`\<`Evm`\>

Defined in: [packages/evm/src/EvmType.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L18)

#### Parameters

##### options?

`EVMOpts`

#### Returns

`Promise`\<`Evm`\>
