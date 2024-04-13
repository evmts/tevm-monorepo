**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Db

# Interface: Db`<TKey, TValue>`

## Type parameters

▪ **TKey** extends `Uint8Array` \| `string` \| `number` = `Uint8Array`

▪ **TValue** extends `Uint8Array` \| `string` \| [`DbObject`](../type-aliases/DbObject.md) = `Uint8Array`

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Performs a batch operation on db.

#### Parameters

▪ **opStack**: [`BatchDbOp`](../type-aliases/BatchDbOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:52

***

### del()

> **del**(`key`, `opts`?): `Promise`\<`void`\>

Removes a raw value in the underlying db.

#### Parameters

▪ **key**: `TKey`

▪ **opts?**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:47

***

### get()

> **get**(`key`, `opts`?): `Promise`\<`undefined` \| `TValue`\>

Retrieves a raw value from db.

#### Parameters

▪ **key**: `TKey`

▪ **opts?**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:36

***

### open()

> **open**(): `Promise`\<`void`\>

Opens the database -- if applicable

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:61

***

### put()

> **put**(`key`, `val`, `opts`?): `Promise`\<`void`\>

Writes a value directly to db.

#### Parameters

▪ **key**: `TKey`

The key as a `TValue`

▪ **val**: `TValue`

▪ **opts?**: [`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:42

***

### shallowCopy()

> **shallowCopy**(): [`Db`](Db.md)\<`TKey`, `TValue`\>

Returns a copy of the DB instance, with a reference
to the **same** underlying db instance.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:57

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
