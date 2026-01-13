[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthFeeHistoryResult

# Type Alias: EthFeeHistoryResult

> **EthFeeHistoryResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L66)

JSON-RPC response for `eth_feeHistory` procedure

## Properties

### baseFeePerGas

> **baseFeePerGas**: `bigint`[]

Defined in: [packages/actions/src/eth/EthResult.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L76)

An array of block base fees per gas. This includes the next block after
the newest of the returned range, because this value can be derived from
the newest block. Zeroes are returned for pre-EIP-1559 blocks.

***

### gasUsedRatio

> **gasUsedRatio**: `number`[]

Defined in: [packages/actions/src/eth/EthResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L81)

An array of block gas used ratios. These are calculated as the ratio
of gasUsed and gasLimit.

***

### oldestBlock

> **oldestBlock**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L70)

Lowest number block of the returned range.

***

### reward?

> `optional` **reward**: `bigint`[][]

Defined in: [packages/actions/src/eth/EthResult.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L86)

An array of effective priority fee per gas data points from a single
block. All zeroes are returned if the block is empty.
