[tevm](../README.md) / [Modules](../modules.md) / [state](../modules/state.md) / TevmStateManagerInterface

# Interface: TevmStateManagerInterface

[state](../modules/state.md).TevmStateManagerInterface

## Hierarchy

- `EVMStateManagerInterface`

  ↳ **`TevmStateManagerInterface`**

## Implemented by

- [`ForkStateManager`](../classes/state.ForkStateManager.md)
- [`NormalStateManager`](../classes/state.NormalStateManager.md)
- [`ProxyStateManager`](../classes/state.ProxyStateManager.md)

## Table of contents

### Properties

- [getAccountAddresses](state.TevmStateManagerInterface.md#getaccountaddresses)
- [originalStorageCache](state.TevmStateManagerInterface.md#originalstoragecache)

### Methods

- [checkpoint](state.TevmStateManagerInterface.md#checkpoint)
- [clearContractStorage](state.TevmStateManagerInterface.md#clearcontractstorage)
- [commit](state.TevmStateManagerInterface.md#commit)
- [deleteAccount](state.TevmStateManagerInterface.md#deleteaccount)
- [dumpStorage](state.TevmStateManagerInterface.md#dumpstorage)
- [dumpStorageRange](state.TevmStateManagerInterface.md#dumpstoragerange)
- [generateCanonicalGenesis](state.TevmStateManagerInterface.md#generatecanonicalgenesis)
- [getAccount](state.TevmStateManagerInterface.md#getaccount)
- [getAppliedKey](state.TevmStateManagerInterface.md#getappliedkey)
- [getContractCode](state.TevmStateManagerInterface.md#getcontractcode)
- [getContractStorage](state.TevmStateManagerInterface.md#getcontractstorage)
- [getProof](state.TevmStateManagerInterface.md#getproof)
- [getStateRoot](state.TevmStateManagerInterface.md#getstateroot)
- [hasStateRoot](state.TevmStateManagerInterface.md#hasstateroot)
- [modifyAccountFields](state.TevmStateManagerInterface.md#modifyaccountfields)
- [putAccount](state.TevmStateManagerInterface.md#putaccount)
- [putContractCode](state.TevmStateManagerInterface.md#putcontractcode)
- [putContractStorage](state.TevmStateManagerInterface.md#putcontractstorage)
- [revert](state.TevmStateManagerInterface.md#revert)
- [setStateRoot](state.TevmStateManagerInterface.md#setstateroot)
- [shallowCopy](state.TevmStateManagerInterface.md#shallowcopy)

## Properties

### getAccountAddresses

• **getAccountAddresses**: () => \`0x$\{string}\`[]

#### Type declaration

▸ (): \`0x$\{string}\`[]

##### Returns

\`0x$\{string}\`[]

#### Defined in

evmts-monorepo/packages/state/types/TevmStateManagerInterface.d.ts:4

___

### originalStorageCache

• **originalStorageCache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear` | () => `void` |
| `get` | (`address`: [`EthjsAddress`](../classes/utils.EthjsAddress.md), `key`: `Uint8Array`) => `Promise`\<`Uint8Array`\> |

#### Inherited from

EvmStateManagerInterface.originalStorageCache

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint

▸ **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.checkpoint

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.clearContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

___

### commit

▸ **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.commit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.deleteAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |

#### Returns

`Promise`\<`StorageDump`\>

#### Inherited from

EvmStateManagerInterface.dumpStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`\<`StorageRange`\>

#### Inherited from

EvmStateManagerInterface.dumpStorageRange

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

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

EvmStateManagerInterface.generateCanonicalGenesis

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

___

### getAccount

▸ **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../classes/utils.EthjsAccount.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../classes/utils.EthjsAccount.md)\>

#### Inherited from

EvmStateManagerInterface.getAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

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

EvmStateManagerInterface.getAppliedKey

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

EvmStateManagerInterface.getContractCode

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

EvmStateManagerInterface.getContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `storageSlots?` | `Uint8Array`[] |

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

EvmStateManagerInterface.getProof

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

___

### getStateRoot

▸ **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

EvmStateManagerInterface.getStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

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

EvmStateManagerInterface.hasStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `accountFields` | `Partial`\<`Pick`\<[`EthjsAccount`](../classes/utils.EthjsAccount.md), ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.modifyAccountFields

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

___

### putAccount

▸ **putAccount**(`address`, `account?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `account?` | [`EthjsAccount`](../classes/utils.EthjsAccount.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.putAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.putContractCode

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.putContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

___

### revert

▸ **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.revert

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

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

EvmStateManagerInterface.setStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

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

EvmStateManagerInterface.shallowCopy

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
