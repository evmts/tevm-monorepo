[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilMineDetailedResult

# Type Alias: AnvilMineDetailedResult

> **AnvilMineDetailedResult** = `object`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L115)

## Properties

### blocks

> **blocks**: `object`[]

Defined in: [packages/actions/src/anvil/AnvilResult.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L117)

Array of mined blocks with detailed information

#### gasLimit

> **gasLimit**: [`Hex`](Hex.md)

Gas limit of the block

#### gasUsed

> **gasUsed**: [`Hex`](Hex.md)

Gas used in the block

#### hash

> **hash**: [`Hex`](Hex.md)

Block hash

#### number

> **number**: [`Hex`](Hex.md)

Block number

#### timestamp

> **timestamp**: [`Hex`](Hex.md)

Block timestamp

#### transactions

> **transactions**: `object`[]

Transactions included in the block with traces
