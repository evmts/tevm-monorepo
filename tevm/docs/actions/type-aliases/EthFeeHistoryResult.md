[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthFeeHistoryResult

# Type Alias: EthFeeHistoryResult

> **EthFeeHistoryResult** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:47

JSON-RPC response for `eth_feeHistory` procedure

## Properties

### baseFeePerGas

> **baseFeePerGas**: `bigint`[]

Defined in: packages/actions/types/eth/EthResult.d.ts:57

An array of block base fees per gas. This includes the next block after
the newest of the returned range, because this value can be derived from
the newest block. Zeroes are returned for pre-EIP-1559 blocks.

***

### gasUsedRatio

> **gasUsedRatio**: `number`[]

Defined in: packages/actions/types/eth/EthResult.d.ts:62

An array of block gas used ratios. These are calculated as the ratio
of gasUsed and gasLimit.

***

### oldestBlock

> **oldestBlock**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:51

Lowest number block of the returned range.

***

### reward?

> `optional` **reward**: `bigint`[][]

Defined in: packages/actions/types/eth/EthResult.d.ts:67

An array of effective priority fee per gas data points from a single
block. All zeroes are returned if the block is empty.
