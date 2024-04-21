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

[packages/state/src/Cache.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L14)

## Properties

### getContractStorage

> **`private`** **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

#### Source

[packages/state/src/Cache.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L13)

***

### map

> **`private`** **map**: `Map`\<`string`, `Map`\<`string`, `Uint8Array`\>\>

#### Source

[packages/state/src/Cache.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L12)

## Methods

### clear()

> **clear**(): `void`

#### Source

[packages/state/src/Cache.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L42)

***

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: `Address`

▪ **key**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L19)

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

▪ **address**: `Address`

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Source

[packages/state/src/Cache.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L29)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
