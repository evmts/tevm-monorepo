[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult**: `object`

Defined in: [packages/actions/src/common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L7)

The type returned by transaction related
json rpc procedures

## Type declaration

### accessList?

> `readonly` `optional` **accessList**: `ReadonlyArray`\<\{ `address`: [`Hex`](Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](Hex.md)\>; \}\>

### blobVersionedHashes?

> `readonly` `optional` **blobVersionedHashes**: `ReadonlyArray`\<[`Hex`](Hex.md)\>

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md)

### blockNumber

> `readonly` **blockNumber**: [`Hex`](Hex.md)

### chainId?

> `readonly` `optional` **chainId**: [`Hex`](Hex.md)

### from

> `readonly` **from**: [`Hex`](Hex.md)

### gas

> `readonly` **gas**: [`Hex`](Hex.md)

### gasPrice

> `readonly` **gasPrice**: [`Hex`](Hex.md)

### hash

> `readonly` **hash**: [`Hex`](Hex.md)

### input

> `readonly` **input**: [`Hex`](Hex.md)

### isImpersonated?

> `readonly` `optional` **isImpersonated**: `boolean`

### maxFeePerBlobGas?

> `readonly` `optional` **maxFeePerBlobGas**: [`Hex`](Hex.md)

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: [`Hex`](Hex.md)

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: [`Hex`](Hex.md)

### nonce

> `readonly` **nonce**: [`Hex`](Hex.md)

### r

> `readonly` **r**: [`Hex`](Hex.md)

### s

> `readonly` **s**: [`Hex`](Hex.md)

### to

> `readonly` **to**: [`Hex`](Hex.md)

### transactionIndex

> `readonly` **transactionIndex**: [`Hex`](Hex.md)

### type?

> `readonly` `optional` **type**: [`Hex`](Hex.md)

### v

> `readonly` **v**: [`Hex`](Hex.md)

### value

> `readonly` **value**: [`Hex`](Hex.md)
