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

[packages/state/src/Cache.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L16)

## Properties

### getContractStorage

> **`private`** **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

#### Source

[packages/state/src/Cache.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L15)

***

### map

> **`private`** **map**: `Map`\<`string`, `Map`\<`string`, `Uint8Array`\>\>

#### Source

[packages/state/src/Cache.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L14)

## Methods

### clear()

> **clear**(): `void`

#### Source

[packages/state/src/Cache.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L46)

***

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: `Address`

▪ **key**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L21)

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

▪ **address**: `Address`

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L33)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
