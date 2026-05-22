[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilAddBalanceParams

# Type Alias: AnvilAddBalanceParams

> **AnvilAddBalanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:294](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L294)

Params for `anvil_addBalance` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address to add balance to | [packages/actions/src/anvil/AnvilParams.ts:298](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L298) |
| <a id="amount"></a> `amount` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The amount to add to the balance | [packages/actions/src/anvil/AnvilParams.ts:302](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L302) |
