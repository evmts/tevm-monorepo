[@tevm/state](../README.md) / [Exports](../modules.md) / Cache

# Class: Cache

## Table of contents

### Constructors

- [constructor](Cache.md#constructor)

### Properties

- [getContractStorage](Cache.md#getcontractstorage)
- [map](Cache.md#map)

### Methods

- [clear](Cache.md#clear)
- [get](Cache.md#get)
- [put](Cache.md#put)

## Constructors

### constructor

• **new Cache**(`getContractStorage`): [`Cache`](Cache.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getContractStorage` | [`GetContractStorage`](../modules.md#getcontractstorage) |

#### Returns

[`Cache`](Cache.md)

#### Defined in

[packages/state/src/Cache.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L17)

## Properties

### getContractStorage

• `Private` **getContractStorage**: [`GetContractStorage`](../modules.md#getcontractstorage)

#### Defined in

[packages/state/src/Cache.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L16)

___

### map

• `Private` **map**: `Map`\<`string`, `Map`\<`string`, `Uint8Array`\>\>

#### Defined in

[packages/state/src/Cache.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L15)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/state/src/Cache.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L47)

___

### get

▸ **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/state/src/Cache.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L22)

___

### put

▸ **put**(`address`, `key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/state/src/Cache.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L34)
