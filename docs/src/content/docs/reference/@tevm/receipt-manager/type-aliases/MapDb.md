---
editUrl: false
next: false
prev: false
title: "MapDb"
---

> **MapDb**: `object`

Helper class to access the metaDB with methods `put`, `get`, and `delete`

## Type declaration

### deepCopy()

#### Returns

[`MapDb`](/reference/tevm/receipt-manager/type-aliases/mapdb/)

### delete()

#### Parameters

• **type**: [`DbType`](/reference/tevm/receipt-manager/type-aliases/dbtype/)

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

### get()

#### Parameters

• **type**: [`DbType`](/reference/tevm/receipt-manager/type-aliases/dbtype/)

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

### put()

#### Parameters

• **type**: [`DbType`](/reference/tevm/receipt-manager/type-aliases/dbtype/)

• **hash**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

## Defined in

[MapDb.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/MapDb.ts#L20)
