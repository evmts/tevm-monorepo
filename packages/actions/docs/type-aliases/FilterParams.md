[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FilterParams

# Type Alias: FilterParams

> **FilterParams** = `object`

Defined in: [packages/actions/src/common/FilterParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L8)

An event filter options object

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address?` | `readonly` | [`Address`](Address.md) | [packages/actions/src/common/FilterParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L11) |
| <a id="fromblock"></a> `fromBlock?` | `readonly` | [`BlockParam`](BlockParam.md) | [packages/actions/src/common/FilterParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L9) |
| <a id="toblock"></a> `toBlock?` | `readonly` | [`BlockParam`](BlockParam.md) | [packages/actions/src/common/FilterParams.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L10) |
| <a id="topics"></a> `topics?` | `readonly` | `ReadonlyArray`\<[`Hex`](Hex.md)\> \| `ReadonlyArray`\<`ReadonlyArray`\<[`Hex`](Hex.md)\>\> | [packages/actions/src/common/FilterParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FilterParams.ts#L12) |
