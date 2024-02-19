[tevm](../README.md) / [Modules](../modules.md) / [state](../modules/state.md) / Cache

# Class: Cache

[state](../modules/state.md).Cache

## Table of contents

### Constructors

- [constructor](state.Cache.md#constructor)

### Properties

- [getContractStorage](state.Cache.md#getcontractstorage)
- [map](state.Cache.md#map)

### Methods

- [clear](state.Cache.md#clear)
- [get](state.Cache.md#get)
- [put](state.Cache.md#put)

## Constructors

### constructor

• **new Cache**(`getContractStorage`): [`Cache`](state.Cache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getContractStorage` | [`GetContractStorage`](../modules/state.md#getcontractstorage) |

#### Returns

[`Cache`](state.Cache.md)

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:6

## Properties

### getContractStorage

• `Private` **getContractStorage**: `any`

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:5

___

### map

• `Private` **map**: `any`

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:4

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:9

___

### get

▸ **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:7

___

### put

▸ **put**(`address`, `key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`void`

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:8
