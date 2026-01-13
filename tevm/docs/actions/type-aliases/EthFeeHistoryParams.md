[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthFeeHistoryParams

# Type Alias: EthFeeHistoryParams

> **EthFeeHistoryParams** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:81

Based on the JSON-RPC request for `eth_feeHistory` procedure

## Properties

### blockCount

> `readonly` **blockCount**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:85

Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query.

***

### newestBlock

> `readonly` **newestBlock**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:89

Highest block number of the requested range as a block tag or block number.

***

### rewardPercentiles?

> `readonly` `optional` **rewardPercentiles**: readonly `number`[]

Defined in: packages/actions/types/eth/EthParams.d.ts:94

A monotonically increasing list of percentile values to sample from each block's
effective priority fees per gas in ascending order, weighted by gas used.
