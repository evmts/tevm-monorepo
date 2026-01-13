[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2BlockResult

# Type Alias: EthSimulateV2BlockResult

> **EthSimulateV2BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:573](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L573)

Result of a simulated block containing multiple call results (V2)
Extends V1 with streamlined output

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:597](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L597)

The base fee per gas for the block

***

### calls

> **calls**: [`EthSimulateV2CallResult`](EthSimulateV2CallResult.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:605](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L605)

Results of the simulated calls in this block

***

### feeRecipient?

> `optional` **feeRecipient**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthResult.ts:601](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L601)

The fee recipient (coinbase)

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:589](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L589)

The gas limit of the block

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:593](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L593)

The gas used in the block

***

### hash

> **hash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L581)

The block hash

***

### number

> **number**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:577](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L577)

The block number

***

### timestamp

> **timestamp**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:585](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L585)

The timestamp of the block
