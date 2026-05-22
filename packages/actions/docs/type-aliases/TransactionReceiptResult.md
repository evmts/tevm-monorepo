[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TransactionReceiptResult

# Type Alias: TransactionReceiptResult

> **TransactionReceiptResult** = `object`

Defined in: [packages/actions/src/common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L7)

Transaction receipt result type for eth JSON-RPC procedures

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blobgasprice"></a> `blobGasPrice?` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L23) |
| <a id="blobgasused"></a> `blobGasUsed?` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L22) |
| <a id="blockhash"></a> `blockHash` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L8) |
| <a id="blocknumber"></a> `blockNumber` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L9) |
| <a id="contractaddress"></a> `contractAddress` | `readonly` | [`Hex`](Hex.md) \| `null` | [packages/actions/src/common/TransactionReceiptResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L10) |
| <a id="cumulativegasused"></a> `cumulativeGasUsed` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L11) |
| <a id="effectivegasprice"></a> `effectiveGasPrice` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L12) |
| <a id="from"></a> `from` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L13) |
| <a id="gasused"></a> `gasUsed` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L14) |
| <a id="logs"></a> `logs` | `readonly` | readonly [`FilterLog`](FilterLog.md)[] | [packages/actions/src/common/TransactionReceiptResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L15) |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L16) |
| <a id="root"></a> `root?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L18) |
| <a id="status"></a> `status?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L17) |
| <a id="to"></a> `to` | `readonly` | [`Hex`](Hex.md) \| `null` | [packages/actions/src/common/TransactionReceiptResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L19) |
| <a id="transactionhash"></a> `transactionHash` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionReceiptResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L20) |
| <a id="transactionindex"></a> `transactionIndex` | `readonly` | `bigint` | [packages/actions/src/common/TransactionReceiptResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L21) |
