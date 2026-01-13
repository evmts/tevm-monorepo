[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1BlockResult

# Type Alias: EthSimulateV1BlockResult

> **EthSimulateV1BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:411](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L411)

Result of a simulated block containing multiple call results

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:435](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L435)

The base fee per gas for the block

***

### calls

> **calls**: [`EthSimulateV1CallResult`](EthSimulateV1CallResult.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:439](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L439)

Results of the simulated calls in this block

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L427)

The gas limit of the block

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:431](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L431)

The gas used in the block

***

### hash

> **hash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:419](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L419)

The block hash

***

### number

> **number**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:415](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L415)

The block number

***

### timestamp

> **timestamp**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:423](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L423)

The timestamp of the block
