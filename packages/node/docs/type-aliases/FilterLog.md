[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / FilterLog

# Type Alias: FilterLog

> **FilterLog** = `object`

Defined in: [packages/node/src/Filter.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L13)

Log entry stored in a filter
Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `Hex` | Address that emitted the log | [packages/node/src/Filter.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L17) |
| <a id="blockhash"></a> `blockHash` | `Hex` | Block hash containing the log | [packages/node/src/Filter.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L21) |
| <a id="blocknumber"></a> `blockNumber` | `bigint` | Block number containing the log | [packages/node/src/Filter.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L25) |
| <a id="data"></a> `data` | `Hex` | Non-indexed log data | [packages/node/src/Filter.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L29) |
| <a id="logindex"></a> `logIndex` | `bigint` | Index of the log within the block | [packages/node/src/Filter.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L33) |
| <a id="removed"></a> `removed` | `boolean` | Whether the log was removed due to a chain reorganization | [packages/node/src/Filter.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L37) |
| <a id="topics"></a> `topics` | \[`Hex`, `...Hex[]`\] | Indexed log topics | [packages/node/src/Filter.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L41) |
| <a id="transactionhash"></a> `transactionHash` | `Hex` | Transaction hash that created the log | [packages/node/src/Filter.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L45) |
| <a id="transactionindex"></a> `transactionIndex` | `bigint` | Index of the transaction within the block | [packages/node/src/Filter.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L49) |
