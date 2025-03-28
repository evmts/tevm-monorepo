[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / StateManagerInterface

# Interface: StateManagerInterface

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:85

## Properties

### accessWitness?

> `optional` **accessWitness**: `AccessWitnessInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:109

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:104

#### clear()

##### Returns

`void`

#### get()

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:112

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:96

#### Returns

`Promise`\<`void`\>

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:95

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:97

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:88

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### dumpStorage()?

> `optional` **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:102

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()?

> `optional` **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:103

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:108

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:86

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:113

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:91

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:92

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:99

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:93

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:101

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### initVerkleExecutionWitness()?

> `optional` **initVerkleExecutionWitness**(`blockNum`, `executionWitness`?, `accessWitness`?): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:110

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `VerkleExecutionWitness`

##### accessWitness?

`AccessWitnessInterface`

#### Returns

`void`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:89

#### Parameters

##### address

`Address`

##### accountFields

`Partial`

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:87

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:90

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:94

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:98

#### Returns

`Promise`\<`void`\>

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:100

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`StateManagerInterface`](StateManagerInterface.md)

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

[`StateManagerInterface`](StateManagerInterface.md)

***

### verifyPostState()?

> `optional` **verifyPostState**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+common@5.0.0-alpha.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:111

#### Returns

`boolean`
