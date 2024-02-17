[@tevm/state](../README.md) / [Exports](../modules.md) / TevmStateManagerInterface

# Interface: TevmStateManagerInterface

## Hierarchy

- `EVMStateManagerInterface`

  ↳ **`TevmStateManagerInterface`**

## Implemented by

- [`ForkStateManager`](../classes/ForkStateManager.md)
- [`NormalStateManager`](../classes/NormalStateManager.md)
- [`ProxyStateManager`](../classes/ProxyStateManager.md)

## Table of contents

### Properties

- [getAccountAddresses](TevmStateManagerInterface.md#getaccountaddresses)
- [originalStorageCache](TevmStateManagerInterface.md#originalstoragecache)

### Methods

- [checkpoint](TevmStateManagerInterface.md#checkpoint)
- [clearContractStorage](TevmStateManagerInterface.md#clearcontractstorage)
- [commit](TevmStateManagerInterface.md#commit)
- [deleteAccount](TevmStateManagerInterface.md#deleteaccount)
- [dumpStorage](TevmStateManagerInterface.md#dumpstorage)
- [dumpStorageRange](TevmStateManagerInterface.md#dumpstoragerange)
- [generateCanonicalGenesis](TevmStateManagerInterface.md#generatecanonicalgenesis)
- [getAccount](TevmStateManagerInterface.md#getaccount)
- [getContractCode](TevmStateManagerInterface.md#getcontractcode)
- [getContractStorage](TevmStateManagerInterface.md#getcontractstorage)
- [getProof](TevmStateManagerInterface.md#getproof)
- [getStateRoot](TevmStateManagerInterface.md#getstateroot)
- [hasStateRoot](TevmStateManagerInterface.md#hasstateroot)
- [modifyAccountFields](TevmStateManagerInterface.md#modifyaccountfields)
- [putAccount](TevmStateManagerInterface.md#putaccount)
- [putContractCode](TevmStateManagerInterface.md#putcontractcode)
- [putContractStorage](TevmStateManagerInterface.md#putcontractstorage)
- [revert](TevmStateManagerInterface.md#revert)
- [setStateRoot](TevmStateManagerInterface.md#setstateroot)
- [shallowCopy](TevmStateManagerInterface.md#shallowcopy)

## Properties

### getAccountAddresses

• **getAccountAddresses**: () => \`0x$\{string}\`[]

#### Type declaration

▸ (): \`0x$\{string}\`[]

##### Returns

\`0x$\{string}\`[]

#### Defined in

[packages/state/src/TevmStateManagerInterface.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManagerInterface.ts#L5)

___

### originalStorageCache

• **originalStorageCache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear` | () => `void` |
| `get` | (`address`: `Address`, `key`: `Uint8Array`) => `Promise`\<`Uint8Array`\> |

#### Inherited from

EVMStateManagerInterface.originalStorageCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:72

## Methods

### checkpoint

▸ **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.checkpoint

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

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

EVMStateManagerInterface.clearContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

___

### commit

▸ **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.commit

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

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

EVMStateManagerInterface.deleteAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`\<`StorageDump`\>

#### Inherited from

EVMStateManagerInterface.dumpStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:76

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`\<`StorageRange`\>

#### Inherited from

EVMStateManagerInterface.dumpStorageRange

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.generateCanonicalGenesis

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

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

EVMStateManagerInterface.getAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

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

EVMStateManagerInterface.getContractCode

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

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

EVMStateManagerInterface.getContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

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

#### Inherited from

EVMStateManagerInterface.getProof

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

___

### getStateRoot

▸ **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

EVMStateManagerInterface.getStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

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

EVMStateManagerInterface.hasStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

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

EVMStateManagerInterface.modifyAccountFields

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

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

EVMStateManagerInterface.putAccount

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

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

EVMStateManagerInterface.putContractCode

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

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

EVMStateManagerInterface.putContractStorage

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

___

### revert

▸ **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.revert

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

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

EVMStateManagerInterface.setStateRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): `EVMStateManagerInterface`

#### Parameters

| Name | Type |
| :------ | :------ |
| `downlevelCaches?` | `boolean` |

#### Returns

`EVMStateManagerInterface`

#### Inherited from

EVMStateManagerInterface.shallowCopy

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80
