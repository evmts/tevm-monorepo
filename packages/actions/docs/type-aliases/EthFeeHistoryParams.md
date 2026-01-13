[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthFeeHistoryParams

# Type Alias: EthFeeHistoryParams

> **EthFeeHistoryParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:102](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L102)

Based on the JSON-RPC request for `eth_feeHistory` procedure

## Properties

### blockCount

> `readonly` **blockCount**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L106)

Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query.

***

### newestBlock

> `readonly` **newestBlock**: [`BlockParam`](BlockParam.md)

Defined in: [packages/actions/src/eth/EthParams.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L110)

Highest block number of the requested range as a block tag or block number.

***

### rewardPercentiles?

> `readonly` `optional` **rewardPercentiles**: readonly `number`[]

Defined in: [packages/actions/src/eth/EthParams.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L115)

A monotonically increasing list of percentile values to sample from each block's
effective priority fees per gas in ascending order, weighted by gas used.
