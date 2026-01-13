[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2BlockResult

# Type Alias: EthSimulateV2BlockResult

> **EthSimulateV2BlockResult** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:470

Result of a simulated block containing multiple call results (V2)
Extends V1 with streamlined output

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:494

The base fee per gas for the block

***

### calls

> **calls**: [`EthSimulateV2CallResult`](EthSimulateV2CallResult.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:502

Results of the simulated calls in this block

***

### feeRecipient?

> `optional` **feeRecipient**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:498

The fee recipient (coinbase)

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:486

The gas limit of the block

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:490

The gas used in the block

***

### hash

> **hash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:478

The block hash

***

### number

> **number**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:474

The block number

***

### timestamp

> **timestamp**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:482

The timestamp of the block
