[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilMineDetailedResult

# Type Alias: AnvilMineDetailedResult

> **AnvilMineDetailedResult** = `object`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:73

## Properties

### blocks

> **blocks**: `object`[]

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:75

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
