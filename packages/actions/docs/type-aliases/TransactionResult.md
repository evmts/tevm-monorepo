[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult** = `object`

Defined in: [packages/actions/src/common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L7)

The type returned by transaction related
json rpc procedures

## Properties

### accessList?

> `readonly` `optional` **accessList**: `ReadonlyArray`\<\{ `address`: [`Hex`](Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](Hex.md)\>; \}\>

Defined in: [packages/actions/src/common/TransactionResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L26)

***

### blobVersionedHashes?

> `readonly` `optional` **blobVersionedHashes**: `ReadonlyArray`\<[`Hex`](Hex.md)\>

Defined in: [packages/actions/src/common/TransactionResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L31)

***

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L8)

***

### blockNumber

> `readonly` **blockNumber**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L9)

***

### chainId?

> `readonly` `optional` **chainId**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L22)

***

### from

> `readonly` **from**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L10)

***

### gas

> `readonly` **gas**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L11)

***

### gasPrice

> `readonly` **gasPrice**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L12)

***

### hash

> `readonly` **hash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L13)

***

### input

> `readonly` **input**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L14)

***

### isImpersonated?

> `readonly` `optional` **isImpersonated**: `boolean`

Defined in: [packages/actions/src/common/TransactionResult.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L32)

***

### maxFeePerBlobGas?

> `readonly` `optional` **maxFeePerBlobGas**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L30)

***

### maxFeePerGas?

> `readonly` `optional` **maxFeePerGas**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L23)

***

### maxPriorityFeePerGas?

> `readonly` `optional` **maxPriorityFeePerGas**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L24)

***

### nonce

> `readonly` **nonce**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L15)

***

### r

> `readonly` **r**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L20)

***

### s

> `readonly` **s**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L21)

***

### to

> `readonly` **to**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L16)

***

### transactionIndex

> `readonly` **transactionIndex**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L17)

***

### type?

> `readonly` `optional` **type**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L25)

***

### v

> `readonly` **v**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L19)

***

### value

> `readonly` **value**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L18)
