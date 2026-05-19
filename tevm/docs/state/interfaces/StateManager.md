[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:174

## Extends

- `Omit`\<[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md), `"getAccount"` \| `"putAccount"` \| `"modifyAccountFields"` \| `"shallowCopy"`\>

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:178

The internal state representation

***

### checkChunkWitnessPresent?

> `optional` **checkChunkWitnessPresent?**: (`contract`, `programCounter`) => `Promise`\<`boolean`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

#### Parameters

##### contract

`Address`

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkChunkWitnessPresent`](../../common/interfaces/EvmStateManagerInterface.md#checkchunkwitnesspresent)

***

### getAccountAddresses

> **getAccountAddresses**: () => `Set`\<`` `0x${string}` ``\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:183

Returns contract addresses

#### Returns

`Set`\<`` `0x${string}` ``\>

***

### getAppliedKey?

> `optional` **getAppliedKey?**: (`address`) => `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/EvmStateManagerInterface.md#getappliedkey)

***

### initBinaryTreeExecutionWitness?

> `optional` **initBinaryTreeExecutionWitness?**: (`blockNum`, `executionWitness?`) => `void`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:125

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`BinaryTreeExecutionWitness` \| `null`

#### Returns

`void`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`initBinaryTreeExecutionWitness`](../../common/interfaces/EvmStateManagerInterface.md#initbinarytreeexecutionwitness)

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

#### clear()

> **clear**(): `void`

##### Returns

`void`

#### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### Parameters

###### address

`Address`

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/EvmStateManagerInterface.md#originalstoragecache)

***

### ready

> **ready**: () => `Promise`\<`true`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:179

#### Returns

`Promise`\<`true`\>

***

### verifyBinaryTreePostState?

> `optional` **verifyBinaryTreePostState?**: (`accessWitness`) => `Promise`\<`boolean`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`verifyBinaryTreePostState`](../../common/interfaces/EvmStateManagerInterface.md#verifybinarytreepoststate)

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:112

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkpoint`](../../common/interfaces/EvmStateManagerInterface.md#checkpoint)

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:199

Resets all internal caches

#### Returns

`void`

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearCaches`](../../common/interfaces/EvmStateManagerInterface.md#clearcaches)

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:220

Clears all storage entries for the account

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:111

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearStorage`](../../common/interfaces/EvmStateManagerInterface.md#clearstorage)

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:209

Commits the current state.

#### Parameters

##### createNewStateRoot?

`boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`commit`](../../common/interfaces/EvmStateManagerInterface.md#commit)

***

### deepCopy()

> **deepCopy**(): `Promise`\<`StateManager`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:190

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:104

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`deleteAccount`](../../common/interfaces/EvmStateManagerInterface.md#deleteaccount)

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:195

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:224

Dumps storage based on the input

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorage`](../../common/interfaces/EvmStateManagerInterface.md#dumpstorage)

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:228

Dumps a range of storage values

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorageRange`](../../common/interfaces/EvmStateManagerInterface.md#dumpstoragerange)

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:232

Loads a state from a given state root

#### Parameters

##### state

[`TevmState`](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`generateCanonicalGenesis`](../../common/interfaces/EvmStateManagerInterface.md#generatecanonicalgenesis)

***

### getAccount()

> **getAccount**(`address`): `Promise`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:184

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined`\>

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:107

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCode`](../../common/interfaces/EvmStateManagerInterface.md#getcode)

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:108

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCodeSize`](../../common/interfaces/EvmStateManagerInterface.md#getcodesize)

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:239

Get an EIP-1186 proof from the provider

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

The address to get proof for

##### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

Storage slots to include in the proof

#### Returns

`Promise`\<`Proof`\>

The account and storage proof

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#getstateroot)

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:109

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStorage`](../../common/interfaces/EvmStateManagerInterface.md#getstorage)

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#hasstateroot)

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:186

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### accountFields

[`AccountFields`](../../common/type-aliases/AccountFields.md)

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:185

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### account?

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:106

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putCode`](../../common/interfaces/EvmStateManagerInterface.md#putcode)

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:110

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putStorage`](../../common/interfaces/EvmStateManagerInterface.md#putstorage)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`revert`](../../common/interfaces/EvmStateManagerInterface.md#revert)

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:205

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

##### root

`Uint8Array`

##### state

[`TevmState`](../../index/type-aliases/TevmState.md)

#### Returns

`void`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`setStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#setstateroot)

***

### shallowCopy()

> **shallowCopy**(): `StateManager`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:191

#### Returns

`StateManager`
