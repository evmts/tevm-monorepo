[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / EvmStateManagerInterface

# Interface: EvmStateManagerInterface

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:135

## Extends

- `StateManagerInterface`

## Extended by

- [`StateManager`](../../state/interfaces/StateManager.md)

## Properties

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

#### clear()

##### Returns

`void`

#### get()

##### Parameters

###### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

#### Parameters

##### contract

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`StateManagerInterface.checkChunkWitnessPresent`

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.checkpoint`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.clearContractStorage`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:125

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.commit`

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.deleteAccount`

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Inherited from

`StateManagerInterface.getAccount`

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`StateManagerInterface.getAppliedKey`

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`StateManagerInterface.getContractCode`

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`number`\>

#### Inherited from

`StateManagerInterface.getContractCodeSize`

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`StateManagerInterface.getContractStorage`

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`Proof`\>

#### Overrides

`StateManagerInterface.getProof`

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`StateManagerInterface.getStateRoot`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`StateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### accountFields

`Partial`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### account?

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.putAccount`

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.putContractCode`

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

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

`StateManagerInterface.putContractStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.revert`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](EvmStateManagerInterface.md)

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

[`EvmStateManagerInterface`](EvmStateManagerInterface.md)

#### Overrides

`StateManagerInterface.shallowCopy`
