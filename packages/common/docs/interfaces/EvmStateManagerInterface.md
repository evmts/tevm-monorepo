[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / EvmStateManagerInterface

# Interface: EvmStateManagerInterface

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:101

## Properties

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:112

#### Returns

`Promise`\<`void`\>

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:129

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:111

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:113

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:104

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### dumpStorage()?

> `optional` **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:102

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Account` \| `undefined`\>

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:107

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:108

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:109

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### initBinaryTreeExecutionWitness()?

> `optional` **initBinaryTreeExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:125

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`BinaryTreeExecutionWitness` \| `null`

#### Returns

`void`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:105

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:103

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:106

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:110

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Returns

`Promise`\<`void`\>

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

***

### verifyBinaryTreePostState()?

> `optional` **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>
