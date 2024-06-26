[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / JsonTx

# Interface: JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JsonAccessListItem`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:360

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `string`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:365

***

### chainId?

> `optional` **chainId**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:359

***

### data?

> `optional` **data**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:354

***

### gasLimit?

> `optional` **gasLimit**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:352

***

### gasPrice?

> `optional` **gasPrice**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:351

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:364

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:363

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:362

***

### nonce?

> `optional` **nonce**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:350

***

### r?

> `optional` **r**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:356

***

### s?

> `optional` **s**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:357

***

### to?

> `optional` **to**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:353

***

### type?

> `optional` **type**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:361

***

### v?

> `optional` **v**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:355

***

### value?

> `optional` **value**: `string`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:358
