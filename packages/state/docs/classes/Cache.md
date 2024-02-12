**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Cache

# Class: Cache

## Constructors

### new Cache(getContractStorage)

> **new Cache**(`getContractStorage`): [`Cache`](Cache.md)

#### Parameters

▪ **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

#### Source

[packages/state/src/Cache.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L17)

## Properties

### getContractStorage

> **`private`** **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

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

▪ **address**: `Address`

▪ **key**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L22)

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

▪ **address**: `Address`

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L34)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
