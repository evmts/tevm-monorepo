[@tevm/common](../README.md) / [Exports](../modules.md) / EvmStateManagerInterface

# Interface: EvmStateManagerInterface

## Hierarchy

- `StateManagerInterface`

  ↳ **`EvmStateManagerInterface`**

## Table of contents

### Properties

- [originalStorageCache](EvmStateManagerInterface.md#originalstoragecache)

### Methods

- [checkpoint](EvmStateManagerInterface.md#checkpoint)
- [clearContractStorage](EvmStateManagerInterface.md#clearcontractstorage)
- [commit](EvmStateManagerInterface.md#commit)
- [deleteAccount](EvmStateManagerInterface.md#deleteaccount)
- [dumpStorage](EvmStateManagerInterface.md#dumpstorage)
- [dumpStorageRange](EvmStateManagerInterface.md#dumpstoragerange)
- [generateCanonicalGenesis](EvmStateManagerInterface.md#generatecanonicalgenesis)
- [getAccount](EvmStateManagerInterface.md#getaccount)
- [getAppliedKey](EvmStateManagerInterface.md#getappliedkey)
- [getContractCode](EvmStateManagerInterface.md#getcontractcode)
- [getContractStorage](EvmStateManagerInterface.md#getcontractstorage)
- [getProof](EvmStateManagerInterface.md#getproof)
- [getStateRoot](EvmStateManagerInterface.md#getstateroot)
- [hasStateRoot](EvmStateManagerInterface.md#hasstateroot)
- [modifyAccountFields](EvmStateManagerInterface.md#modifyaccountfields)
- [putAccount](EvmStateManagerInterface.md#putaccount)
- [putContractCode](EvmStateManagerInterface.md#putcontractcode)
- [putContractStorage](EvmStateManagerInterface.md#putcontractstorage)
- [revert](EvmStateManagerInterface.md#revert)
- [setStateRoot](EvmStateManagerInterface.md#setstateroot)
- [shallowCopy](EvmStateManagerInterface.md#shallowcopy)

## Properties

### originalStorageCache

• **originalStorageCache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear` | () => `void` |
| `get` | (`address`: `Address`, `key`: `Uint8Array`) => `Promise`\<`Uint8Array`\> |

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint

▸ **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.checkpoint

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.clearContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

___

### commit

▸ **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.commit

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.deleteAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`\<[`StorageDump`](StorageDump.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<[`StorageDump`](StorageDump.md)\>

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](StorageRange.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`\<[`StorageRange`](StorageRange.md)\>

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

___

### getAccount

▸ **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Inherited from

StateManagerInterface.getAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

___

### getAppliedKey

▸ **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Inherited from

StateManagerInterface.getAppliedKey

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

StateManagerInterface.getContractCode

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

StateManagerInterface.getContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageSlots?` | `Uint8Array`[] |

#### Returns

`Promise`\<`Proof`\>

#### Overrides

StateManagerInterface.getProof

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

___

### getStateRoot

▸ **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

StateManagerInterface.getStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

StateManagerInterface.hasStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `accountFields` | `Partial`\<`Pick`\<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.modifyAccountFields

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

___

### putAccount

▸ **putAccount**(`address`, `account?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `account?` | `Account` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.putAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.putContractCode

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.putContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

___

### revert

▸ **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.revert

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | `Uint8Array` |
| `clearCache?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

StateManagerInterface.setStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): [`EvmStateManagerInterface`](EvmStateManagerInterface.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `downlevelCaches?` | `boolean` |

#### Returns

[`EvmStateManagerInterface`](EvmStateManagerInterface.md)

#### Overrides

StateManagerInterface.shallowCopy

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
