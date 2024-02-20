---
editUrl: false
next: false
prev: false
title: "Cache"
---

## Constructors

### new Cache(getContractStorage)

> **new Cache**(`getContractStorage`): [`Cache`](/reference/tevm/state/classes/cache/)

#### Parameters

▪ **getContractStorage**: [`GetContractStorage`](/reference/tevm/state/type-aliases/getcontractstorage/)

#### Source

[packages/state/src/Cache.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L17)

## Properties

### getContractStorage

> **`private`** **getContractStorage**: [`GetContractStorage`](/reference/tevm/state/type-aliases/getcontractstorage/)

#### Source

[packages/state/src/Cache.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L16)

***

### map

> **`private`** **map**: `Map`\<`string`, `Map`\<`string`, `Uint8Array`\>\>

#### Source

[packages/state/src/Cache.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L15)

## Methods

### clear()

> **clear**(): `void`

#### Source

[packages/state/src/Cache.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L47)

***

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L22)

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L34)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
