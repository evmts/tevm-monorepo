[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / JsonTx

# Interface: JsonTx

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:475

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList?**: `JSONAccessListItem`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:486

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationList`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:487

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:492

***

### chainId?

> `optional` **chainId?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:485

***

### data?

> `optional` **data?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:480

***

### gasLimit?

> `optional` **gasLimit?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:478

***

### gasPrice?

> `optional` **gasPrice?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:477

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:491

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:490

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:489

***

### nonce?

> `optional` **nonce?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:476

***

### r?

> `optional` **r?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:482

***

### s?

> `optional` **s?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:483

***

### to?

> `optional` **to?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:479

***

### type?

> `optional` **type?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:488

***

### v?

> `optional` **v?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:481

***

### value?

> `optional` **value?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:484

***

### yParity?

> `optional` **yParity?**: `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:493
