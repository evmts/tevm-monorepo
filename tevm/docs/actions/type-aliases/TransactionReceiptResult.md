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

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:20

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:19

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

> `readonly` **contractAddress**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:9

***

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:10

***

### from

> `readonly` **from**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:11

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:12

***

### logs

> `readonly` **logs**: readonly [`FilterLog`](FilterLog.md)[]

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:13

***

### logsBloom

> `readonly` **logsBloom**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:14

***

### status

> `readonly` **status**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:15

***

### to

> `readonly` **to**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:16

***

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:17

***

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

Defined in: packages/actions/types/common/TransactionReceiptResult.d.ts:18
