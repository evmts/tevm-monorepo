[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / Storage

# Interface: Storage

Defined in: [Storage.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L1)

## Properties

### getItem()

> **getItem**: (`key`) => `null` \| `string`

Defined in: [Storage.ts:2](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L2)

#### Parameters

##### key

`string`

#### Returns

`null` \| `string`

***

### removeItem()

> **removeItem**: (`key`) => `void`

Defined in: [Storage.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L4)

#### Parameters

##### key

`string`

#### Returns

`void`

***

### setItem()

> **setItem**: (`key`, `value`) => `void`

Defined in: [Storage.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L3)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
