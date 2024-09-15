[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / EvmStateManagerInterface

# Interface: EvmStateManagerInterface

## Extends

- `StateManagerInterface`

## Properties

### originalStorageCache

> **originalStorageCache**: `object`

#### clear()

##### Returns

`void`

#### get()

##### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

#### Parameters

• **contract**: `Address`

• **programCounter**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`StateManagerInterface.checkChunkWitnessPresent`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.checkpoint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.clearContractStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.commit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:125

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.deleteAccount`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

#### Parameters

• **address**: `Address`

• **startKey**: `bigint`

• **limit**: `number`

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Inherited from

`StateManagerInterface.getAccount`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`StateManagerInterface.getAppliedKey`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`StateManagerInterface.getContractCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`StateManagerInterface.getContractCodeSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`StateManagerInterface.getContractStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: `Address`

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Overrides

`StateManagerInterface.getProof`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`StateManagerInterface.getStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`StateManagerInterface.hasStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **accountFields**: `Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.modifyAccountFields`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **account?**: `Account`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.putAccount`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.putContractCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.putContractStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.revert`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.setStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](EvmStateManagerInterface.md)

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

[`EvmStateManagerInterface`](EvmStateManagerInterface.md)

#### Overrides

`StateManagerInterface.shallowCopy`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144
