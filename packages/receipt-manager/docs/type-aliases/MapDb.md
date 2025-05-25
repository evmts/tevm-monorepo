[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / MapDb

# Type Alias: MapDb

> **MapDb** = `object`

Defined in: MapDb.ts:29

Helper class to access the metaDB with methods for managing receipts and transaction data

## Methods

### deepCopy()

> **deepCopy**(): `MapDb`

Defined in: MapDb.ts:57

Create a deep copy of the MapDb instance

#### Returns

`MapDb`

A new MapDb instance with a copy of the data

***

### delete()

> **delete**(`type`, `hash`): `Promise`\<`void`\>

Defined in: MapDb.ts:51

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

***

### get()

> **get**(`type`, `hash`): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: MapDb.ts:44

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

***

### put()

> **put**(`type`, `hash`, `value`): `Promise`\<`void`\>

Defined in: MapDb.ts:36

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
