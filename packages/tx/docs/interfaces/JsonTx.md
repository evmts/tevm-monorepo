[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / JSONTx

# Interface: JSONTx

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:406

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList**: `JSONAccessListItem`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:417

***

### authorizationList?

> `optional` **authorizationList**: `AuthorizationList`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:418

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:423

***

### chainId?

> `optional` **chainId**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:416

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:411

***

### gasLimit?

> `optional` **gasLimit**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:409

***

### gasPrice?

> `optional` **gasPrice**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:408

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:422

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:421

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:420

***

### nonce?

> `optional` **nonce**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:407

***

### r?

> `optional` **r**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:413

***

### s?

> `optional` **s**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:414

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:410

***

### type?

> `optional` **type**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:419

***

### v?

> `optional` **v**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:412

***

### value?

> `optional` **value**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:415

***

### yParity?

> `optional` **yParity**: `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:424
