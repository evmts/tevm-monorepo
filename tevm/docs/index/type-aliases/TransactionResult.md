[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult** = `object`

Defined in: packages/actions/types/common/TransactionResult.d.ts:6

The type returned by transaction related
json rpc procedures

## Properties

### accessList?

> `readonly` `optional` **accessList**: `ReadonlyArray`\<\{ `address`: [`Hex`](../../actions/type-aliases/Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\>; \}\>

Defined in: packages/actions/types/common/TransactionResult.d.ts:25

***

### blobVersionedHashes?

> `readonly` `optional` **blobVersionedHashes**: `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\>

Defined in: packages/actions/types/common/TransactionResult.d.ts:30

***

### blockHash

> `readonly` **blockHash**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:7

***

### blockNumber

> `readonly` **blockNumber**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:8

***

### chainId?

> `readonly` `optional` **chainId**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:21

***

### from

> `readonly` **from**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:9

***

### gas

> `readonly` **gas**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:10

***

### gasPrice

> `readonly` **gasPrice**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:11

***

### hash

> `readonly` **hash**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:12

***

### input

> `readonly` **input**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:13

***

### isImpersonated?

> `readonly` `optional` **isImpersonated**: `boolean`

Defined in: packages/actions/types/common/TransactionResult.d.ts:31

***

### maxFeePerBlobGas?

> `readonly` `optional` **maxFeePerBlobGas**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:29

***

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:22

***

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:23

***

### nonce

> `readonly` **nonce**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:14

***

### r

> `readonly` **r**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:19

***

### s

> `readonly` **s**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:20

***

### to

> `readonly` **to**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:15

***

### transactionIndex

> `readonly` **transactionIndex**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:16

***

### type?

> `readonly` `optional` **type**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:24

***

### v

> `readonly` **v**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:18

***

### value

> `readonly` **value**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/TransactionResult.d.ts:17
