[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult**: `object`

Defined in: packages/actions/types/common/TransactionResult.d.ts:6

The type returned by transaction related
json rpc procedures

## Type declaration

### accessList?

> `readonly` `optional` **accessList**: `ReadonlyArray`\<\{ `address`: [`Hex`](../../actions/type-aliases/Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\>; \}\>

### blobVersionedHashes?

> `readonly` `optional` **blobVersionedHashes**: `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\>

### blockHash

> `readonly` **blockHash**: [`Hex`](../../actions/type-aliases/Hex.md)

### blockNumber

> `readonly` **blockNumber**: [`Hex`](../../actions/type-aliases/Hex.md)

### chainId?

> `readonly` `optional` **chainId**: [`Hex`](../../actions/type-aliases/Hex.md)

### from

> `readonly` **from**: [`Hex`](../../actions/type-aliases/Hex.md)

### gas

> `readonly` **gas**: [`Hex`](../../actions/type-aliases/Hex.md)

### gasPrice

> `readonly` **gasPrice**: [`Hex`](../../actions/type-aliases/Hex.md)

### hash

> `readonly` **hash**: [`Hex`](../../actions/type-aliases/Hex.md)

### input

> `readonly` **input**: [`Hex`](../../actions/type-aliases/Hex.md)

### isImpersonated?

> `readonly` `optional` **isImpersonated**: `boolean`

### maxFeePerBlobGas?

> `readonly` `optional` **maxFeePerBlobGas**: [`Hex`](../../actions/type-aliases/Hex.md)

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: [`Hex`](../../actions/type-aliases/Hex.md)

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: [`Hex`](../../actions/type-aliases/Hex.md)

### nonce

> `readonly` **nonce**: [`Hex`](../../actions/type-aliases/Hex.md)

### r

> `readonly` **r**: [`Hex`](../../actions/type-aliases/Hex.md)

### s

> `readonly` **s**: [`Hex`](../../actions/type-aliases/Hex.md)

### to

> `readonly` **to**: [`Hex`](../../actions/type-aliases/Hex.md)

### transactionIndex

> `readonly` **transactionIndex**: [`Hex`](../../actions/type-aliases/Hex.md)

### type?

> `readonly` `optional` **type**: [`Hex`](../../actions/type-aliases/Hex.md)

### v

> `readonly` **v**: [`Hex`](../../actions/type-aliases/Hex.md)

### value

> `readonly` **value**: [`Hex`](../../actions/type-aliases/Hex.md)
