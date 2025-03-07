[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / JsonTx

# Interface: JsonTx

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:390

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JsonAccessListItem`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:401

***

### authorizationList?

> `optional` **authorizationList**: `AuthorizationList`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:402

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:407

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:400

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:395

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:393

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:392

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:406

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:405

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:404

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:391

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:397

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:398

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:394

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:403

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:396

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:399
