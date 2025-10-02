[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TransactionReceiptResult

# Type Alias: TransactionReceiptResult

> **TransactionReceiptResult** = `object`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:6

Transaction receipt result type for eth JSON-RPC procedures

## Properties

### blobGasPrice?

> `readonly` `optional` **blobGasPrice**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:22

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:21

***

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:7

***

### blockNumber

> `readonly` **blockNumber**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:8

***

### contractAddress

> `readonly` **contractAddress**: [`Hex`](Hex.md) \| `null`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:9

***

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:10

***

### effectiveGasPrice

> `readonly` **effectiveGasPrice**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:11

***

### from

> `readonly` **from**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:12

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:13

***

### logs

> `readonly` **logs**: readonly [`FilterLog`](FilterLog.md)[]

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:14

***

### logsBloom

> `readonly` **logsBloom**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:15

***

### root?

> `readonly` `optional` **root**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:17

***

### status?

> `readonly` `optional` **status**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:16

***

### to

> `readonly` **to**: [`Hex`](Hex.md) \| `null`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:18

***

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:19

***

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:20
