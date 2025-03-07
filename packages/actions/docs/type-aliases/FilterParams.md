[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FilterParams

# Type Alias: FilterParams

> **FilterParams**: `object`

Defined in: [packages/actions/src/common/FilterParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L8)

An event filter options object

## Type declaration

### address?

> `readonly` `optional` **address**: [`Address`](Address.md)

### fromBlock?

> `readonly` `optional` **fromBlock**: [`BlockParam`](BlockParam.md)

### toBlock?

> `readonly` `optional` **toBlock**: [`BlockParam`](BlockParam.md)

### topics?

> `readonly` `optional` **topics**: `ReadonlyArray`\<[`Hex`](Hex.md)\> \| `ReadonlyArray`\<`ReadonlyArray`\<[`Hex`](Hex.md)\>\>
