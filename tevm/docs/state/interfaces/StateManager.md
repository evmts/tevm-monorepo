[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:147
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:204
=======
Defined in: packages/state/dist/index.d.ts:147
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

## Extends

- [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:151
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:208
=======
Defined in: packages/state/dist/index.d.ts:151
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

The internal state representation

***

### getAccountAddresses()

> **getAccountAddresses**: () => `Set`\<`` `0x${string}` ``\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:156
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:213
=======
Defined in: packages/state/dist/index.d.ts:156
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Returns contract addresses

#### Returns

`Set`\<`` `0x${string}` ``\>

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:164

#### clear()

> **clear**(): `void`

##### Returns

`void`

#### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### Parameters

###### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/EvmStateManagerInterface.md#originalstoragecache)

***

### ready()

> **ready**: () => `Promise`\<`true`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:152
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:209
=======
Defined in: packages/state/dist/index.d.ts:152
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

#### Returns

`Promise`\<`true`\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:173

#### Parameters

##### contract

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkChunkWitnessPresent`](../../common/interfaces/EvmStateManagerInterface.md#checkchunkwitnesspresent)

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:156

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkpoint`](../../common/interfaces/EvmStateManagerInterface.md#checkpoint)

***

### clearCaches()

> **clearCaches**(): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:168
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:225
=======
Defined in: packages/state/dist/index.d.ts:168
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Resets all internal caches

#### Returns

`void`

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearCaches`](../../common/interfaces/EvmStateManagerInterface.md#clearcaches)

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:189
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:246
=======
Defined in: packages/state/dist/index.d.ts:189
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Clears all storage entries for the account

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:155

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearStorage`](../../common/interfaces/EvmStateManagerInterface.md#clearstorage)

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:178
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:235
=======
Defined in: packages/state/dist/index.d.ts:178
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:160
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:217
=======
Defined in: packages/state/dist/index.d.ts:160
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:148

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`deleteAccount`](../../common/interfaces/EvmStateManagerInterface.md#deleteaccount)

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:164
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:221
=======
Defined in: packages/state/dist/index.d.ts:164
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:193
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:250
=======
Defined in: packages/state/dist/index.d.ts:193
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:197
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:254
=======
Defined in: packages/state/dist/index.d.ts:197
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:201
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:258
=======
Defined in: packages/state/dist/index.d.ts:201
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:146

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAccount`](../../common/interfaces/EvmStateManagerInterface.md#getaccount)

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:174

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/EvmStateManagerInterface.md#getappliedkey)

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:151

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCode`](../../common/interfaces/EvmStateManagerInterface.md#getcode)

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:152

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCodeSize`](../../common/interfaces/EvmStateManagerInterface.md#getcodesize)

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:208
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:265
=======
Defined in: packages/state/dist/index.d.ts:208
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:159

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#getstateroot)

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:153

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStorage`](../../common/interfaces/EvmStateManagerInterface.md#getstorage)

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:161

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#hasstateroot)

***

### initBinaryTreeExecutionWitness()?

> `optional` **initBinaryTreeExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:171

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `BinaryTreeExecutionWitness`

#### Returns

`void`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`initBinaryTreeExecutionWitness`](../../common/interfaces/EvmStateManagerInterface.md#initbinarytreeexecutionwitness)

***

### initVerkleExecutionWitness()?

> `optional` **initVerkleExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:169

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `VerkleExecutionWitness`

#### Returns

`void`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`initVerkleExecutionWitness`](../../common/interfaces/EvmStateManagerInterface.md#initverkleexecutionwitness)

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:149

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### accountFields

[`AccountFields`](../../common/type-aliases/AccountFields.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`modifyAccountFields`](../../common/interfaces/EvmStateManagerInterface.md#modifyaccountfields)

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:147

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### account?

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putAccount`](../../common/interfaces/EvmStateManagerInterface.md#putaccount)

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:150

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putCode`](../../common/interfaces/EvmStateManagerInterface.md#putcode)

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:154

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:158

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`revert`](../../common/interfaces/EvmStateManagerInterface.md#revert)

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:174
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:231
=======
Defined in: packages/state/dist/index.d.ts:174
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:160

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

> **shallowCopy**(`downlevelCaches?`): [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:176

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`shallowCopy`](../../common/interfaces/EvmStateManagerInterface.md#shallowcopy)

***

### verifyBinaryTreePostState()?

> `optional` **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:172

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`verifyBinaryTreePostState`](../../common/interfaces/EvmStateManagerInterface.md#verifybinarytreepoststate)

***

### verifyVerklePostState()?

> `optional` **verifyVerklePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:170

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`verifyVerklePostState`](../../common/interfaces/EvmStateManagerInterface.md#verifyverklepoststate)
