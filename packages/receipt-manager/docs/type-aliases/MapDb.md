[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / MapDb

# Type Alias: MapDb

> **MapDb**: `object`

Defined in: [MapDb.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/MapDb.ts#L20)

Helper class to access the metaDB with methods `put`, `get`, and `delete`

## Type declaration

### deepCopy()

#### Returns

[`MapDb`](MapDb.md)

### delete()

#### Parameters

##### type

[`DbType`](DbType.md)

##### hash

`Uint8Array`

#### Returns

`Promise`\<`void`\>

### get()

#### Parameters

##### type

[`DbType`](DbType.md)

##### hash

`Uint8Array`

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

### put()

#### Parameters

##### type

[`DbType`](DbType.md)

##### hash

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>
