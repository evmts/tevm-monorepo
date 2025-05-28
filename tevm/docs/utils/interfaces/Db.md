[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Db

# Interface: Db\<TKey, TValue\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:32

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DbObject`](../type-aliases/DbObject.md) = `Uint8Array`

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:54

Performs a batch operation on db.

#### Parameters

##### opStack

[`BatchDbOp`](../type-aliases/BatchDbOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`, `opts?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:49

Removes a raw value in the underlying db.

#### Parameters

##### key

`TKey`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`, `opts?`): `Promise`\<`undefined` \| `TValue`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:38

Retrieves a raw value from db.

#### Parameters

##### key

`TKey`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`undefined` \| `TValue`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:63

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `val`, `opts?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:44

Writes a value directly to db.

#### Parameters

##### key

`TKey`

The key as a `TValue`

##### val

`TValue`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `DB`\<`TKey`, `TValue`\>

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/db.d.ts:59

Returns a copy of the DB instance, with a reference
to the **same** underlying db instance.

#### Returns

`DB`\<`TKey`, `TValue`\>
