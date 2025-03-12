[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / MapDb

# Type Alias: MapDb

> **MapDb**: `object`

Defined in: [MapDb.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/MapDb.ts#L29)

Helper class to access the metaDB with methods for managing receipts and transaction data

## Type declaration

### deepCopy()

Create a deep copy of the MapDb instance

#### Returns

[`MapDb`](MapDb.md)

A new MapDb instance with a copy of the data

### delete()

Delete a value from the database

#### Parameters

##### type

[`DbType`](DbType.md)

The type of data to delete

##### hash

`Uint8Array`

The hash key for the data to delete

#### Returns

`Promise`\<`void`\>

### get()

Retrieve a value from the database

#### Parameters

##### type

[`DbType`](DbType.md)

The type of data to retrieve

##### hash

`Uint8Array`

The hash key for the data

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The stored value or null if not found

### put()

Store a value in the database

#### Parameters

##### type

[`DbType`](DbType.md)

The type of data being stored

##### hash

`Uint8Array`

The hash key for the data

##### value

`Uint8Array`

The value to store

#### Returns

`Promise`\<`void`\>
