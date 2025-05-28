[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / JsonTx

# Interface: JsonTx

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:404

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:415

***

### authorizationList?

> `optional` **authorizationList**: `EOACode7702AuthorizationList`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:416

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:421

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:414

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:409

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:407

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:406

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:420

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:419

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:418

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:405

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:411

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:412

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:408

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:417

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:410

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:413

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:422
