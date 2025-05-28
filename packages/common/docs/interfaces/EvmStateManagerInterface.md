[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / EvmStateManagerInterface

# Interface: EvmStateManagerInterface

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:145

## Properties

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

`Address`

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:173

#### Parameters

##### contract

`Address`

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:156

#### Returns

`Promise`\<`void`\>

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:175

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:155

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:157

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:148

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### dumpStorage()?

> `optional` **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:162

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:163

#### Parameters

##### address

`Address`

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

***

### generateCanonicalGenesis()?

> `optional` **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:168

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:146

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:174

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:151

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:152

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:159

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:153

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:161

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

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

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:149

#### Parameters

##### address

`Address`

##### accountFields

[`AccountFields`](../type-aliases/AccountFields.md)

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:147

#### Parameters

##### address

`Address`

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:150

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:154

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:158

#### Returns

`Promise`\<`void`\>

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

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches?`): `StateManagerInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:176

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

***

### verifyBinaryTreePostState()?

> `optional` **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:172

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

***

### verifyVerklePostState()?

> `optional` **verifyVerklePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:170

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>
