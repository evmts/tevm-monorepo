[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / MapDb

# Type Alias: MapDb

> **MapDb**: `object`

Helper class to access the metaDB with methods `put`, `get`, and `delete`

## Type declaration

### deepCopy()

#### Returns

[`MapDb`](MapDb.md)

### delete()

#### Parameters

• **type**: [`DbType`](DbType.md)

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

### get()

#### Parameters

• **type**: [`DbType`](DbType.md)

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

### put()

#### Parameters

• **type**: [`DbType`](DbType.md)

• **hash**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

## Defined in

packages/receipt-manager/types/MapDb.d.ts:9
