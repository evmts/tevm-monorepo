**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MapDb

# Class: MapDb`<TKey, TValue>`

## Type parameters

▪ **TKey** extends `Uint8Array` \| `string` \| `number`

▪ **TValue** extends `Uint8Array` \| `string` \| [`DbObject`](../type-aliases/DbObject.md)

## Implements

- [`Db`](../interfaces/Db.md)\<`TKey`, `TValue`\>

## Constructors

### new MapDb(database)

> **new MapDb**\<`TKey`, `TValue`\>(`database`?): [`MapDb`](MapDb.md)\<`TKey`, `TValue`\>

#### Parameters

▪ **database?**: `Map`\<`TKey`, `TValue`\>

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:4

## Properties

### \_database

> **\_database**: `Map`\<`TKey`, `TValue`\>

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:3

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Performs a batch operation on db.

#### Parameters

▪ **opStack**: [`BatchDbOp`](../type-aliases/BatchDbOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Implementation of

[`Db`](../interfaces/Db.md).[`batch`](../interfaces/Db.md#batch)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:8

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Removes a raw value in the underlying db.

#### Parameters

▪ **key**: `TKey`

#### Implementation of

[`Db`](../interfaces/Db.md).[`del`](../interfaces/Db.md#del)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:7

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `TValue`\>

Retrieves a raw value from db.

#### Parameters

▪ **key**: `TKey`

#### Returns

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Implementation of

[`Db`](../interfaces/Db.md).[`get`](../interfaces/Db.md#get)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:5

***

### open()

> **open**(): `Promise`\<`void`\>

Opens the database -- if applicable

#### Implementation of

[`Db`](../interfaces/Db.md).[`open`](../interfaces/Db.md#open)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:15

***

### put()

> **put**(`key`, `val`): `Promise`\<`void`\>

Writes a value directly to db.

#### Parameters

▪ **key**: `TKey`

The key as a `TValue`

▪ **val**: `TValue`

#### Implementation of

[`Db`](../interfaces/Db.md).[`put`](../interfaces/Db.md#put)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:6

***

### shallowCopy()

> **shallowCopy**(): [`Db`](../interfaces/Db.md)\<`TKey`, `TValue`\>

Note that the returned shallow copy will share the underlying database with the original

#### Returns

DB

#### Implementation of

[`Db`](../interfaces/Db.md).[`shallowCopy`](../interfaces/Db.md#shallowcopy)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/mapDB.d.ts:14

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
