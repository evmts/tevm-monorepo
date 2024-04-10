**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > Cache

# Class: Cache

## Constructors

### new Cache(getContractStorage)

> **new Cache**(`getContractStorage`): [`Cache`](Cache.md)

#### Parameters

▪ **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

#### Source

packages/state/types/Cache.d.ts:6

## Properties

### getContractStorage

> **`private`** **getContractStorage**: `any`

#### Source

packages/state/types/Cache.d.ts:5

***

### map

> **`private`** **map**: `any`

#### Source

packages/state/types/Cache.d.ts:4

## Methods

### clear()

> **clear**(): `void`

#### Source

packages/state/types/Cache.d.ts:9

***

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **key**: `Uint8Array`

#### Source

packages/state/types/Cache.d.ts:7

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Source

packages/state/types/Cache.d.ts:8

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
