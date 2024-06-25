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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.checkpoint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.commit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`StateManagerInterface.getStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`StateManagerInterface.revert`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
