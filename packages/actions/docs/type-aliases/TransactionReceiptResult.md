[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TransactionReceiptResult

# Type Alias: TransactionReceiptResult

> **TransactionReceiptResult** = `object`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L7)

Transaction receipt result type for eth JSON-RPC procedures

## Properties

### blobGasPrice?

> `readonly` `optional` **blobGasPrice**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L23)

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L22)

***

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L8)

***

### blockNumber

> `readonly` **blockNumber**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L9)

***

### contractAddress

> `readonly` **contractAddress**: [`Hex`](Hex.md) \| `null`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L10)

***

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L11)

***

### effectiveGasPrice

> `readonly` **effectiveGasPrice**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L12)

***

### from

> `readonly` **from**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L13)

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L14)

***

### logs

> `readonly` **logs**: readonly [`FilterLog`](FilterLog.md)[]

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L15)

***

### logsBloom

> `readonly` **logsBloom**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L16)

***

### root?

> `readonly` `optional` **root**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L18)

***

### status?

> `readonly` `optional` **status**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L17)

***

### to

> `readonly` **to**: [`Hex`](Hex.md) \| `null`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L19)

***

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L20)

***

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L21)
