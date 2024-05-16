[**@tevm/receipt-manager**](../README.md) • **Docs**

***

[@tevm/receipt-manager](../globals.md) / MapDb

# Type alias: MapDb

> **MapDb**: `object`

Helper class to access the metaDB with methods `put`, `get`, and `delete`

## Type declaration

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

## Source

[MapDb.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/MapDb.ts#L20)
