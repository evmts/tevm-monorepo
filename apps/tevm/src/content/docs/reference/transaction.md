---
title: Example Reference
description: A reference page in my new Starlight docs site.
---
### TransactionParams

Ƭ **TransactionParams**: `Object`

A transaction request object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | `Address` |
| `gas?` | `Hex` |
| `gasPrice?` | `Hex` |
| `input` | `Hex` |
| `nonce?` | `Hex` |
| `to?` | `Address` |
| `value?` | `Hex` |

#### Defined in

[common/TransactionParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionParams.ts#L7)

___

### TransactionReceiptResult

Ƭ **TransactionReceiptResult**: `Object`

Transaction receipt result type for eth JSON-RPC procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `blockNumber` | `Hex` |
| `contractAddress` | `Hex` |
| `cumulativeGasUsed` | `Hex` |
| `from` | `Hex` |
| `gasUsed` | `Hex` |
| `logs` | readonly [`FilterLog`](modules.md#filterlog)[] |
| `logsBloom` | `Hex` |
| `status` | `Hex` |
| `to` | `Hex` |
| `transactionHash` | `Hex` |
| `transactionIndex` | `Hex` |

#### Defined in

[common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionReceiptResult.ts#L7)

___

### TransactionResult

Ƭ **TransactionResult**: `Object`

The type returned by transaction related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockHash` | `Hex` |
| `blockNumber` | `Hex` |
| `from` | `Hex` |
| `gas` | `Hex` |
| `gasPrice` | `Hex` |
| `hash` | `Hex` |
| `input` | `Hex` |
| `nonce` | `Hex` |
| `r` | `Hex` |
| `s` | `Hex` |
| `to` | `Hex` |
| `transactionIndex` | `Hex` |
| `v` | `Hex` |
| `value` | `Hex` |

#### Defined in

[common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/TransactionResult.ts#L7)

___

