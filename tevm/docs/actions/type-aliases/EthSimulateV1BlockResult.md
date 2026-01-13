[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1BlockResult

# Type Alias: EthSimulateV1BlockResult

> **EthSimulateV1BlockResult** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:315

Result of a simulated block containing multiple call results

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:339

The base fee per gas for the block

***

### calls

> **calls**: [`EthSimulateV1CallResult`](EthSimulateV1CallResult.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:343

Results of the simulated calls in this block

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:331

The gas limit of the block

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:335

The gas used in the block

***

### hash

> **hash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:323

The block hash

***

### number

> **number**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:319

The block number

***

### timestamp

> **timestamp**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:327

The timestamp of the block
