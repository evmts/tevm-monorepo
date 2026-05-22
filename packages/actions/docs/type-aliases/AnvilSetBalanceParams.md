[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetBalanceParams

# Type Alias: AnvilSetBalanceParams

> **AnvilSetBalanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L115)

Params for `anvil_setBalance` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address to set the balance for | [packages/actions/src/anvil/AnvilParams.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L119) |
| <a id="balance"></a> `balance` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The balance to set | [packages/actions/src/anvil/AnvilParams.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L123) |
