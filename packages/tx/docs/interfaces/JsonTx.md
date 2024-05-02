**@tevm/tx** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonTx

# Interface: JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList

> **accessList**?: `JsonAccessListItem`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:360

***

### blobVersionedHashes

> **blobVersionedHashes**?: `string`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:365

***

### chainId

> **chainId**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:359

***

### data

> **data**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:354

***

### gasLimit

> **gasLimit**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:352

***

### gasPrice

> **gasPrice**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:351

***

### maxFeePerBlobGas

> **maxFeePerBlobGas**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:364

***

### maxFeePerGas

> **maxFeePerGas**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:363

***

### maxPriorityFeePerGas

> **maxPriorityFeePerGas**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:362

***

### nonce

> **nonce**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:350

***

### r

> **r**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:356

***

### s

> **s**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:357

***

### to

> **to**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:353

***

### type

> **type**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:361

***

### v

> **v**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:355

***

### value

> **value**?: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:358

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
