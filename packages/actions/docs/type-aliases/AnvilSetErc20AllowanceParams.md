[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetErc20AllowanceParams

# Type Alias: AnvilSetErc20AllowanceParams

> **AnvilSetErc20AllowanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:237](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L237)

Params for `anvil_setErc20Allowance` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `readonly` | `bigint` | The allowance amount to set | [packages/actions/src/anvil/AnvilParams.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L253) |
| <a id="erc20"></a> `erc20` | `readonly` | [`Address`](Address.md) | The address of the ERC20 token | [packages/actions/src/anvil/AnvilParams.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L241) |
| <a id="owner"></a> `owner` | `readonly` | [`Address`](Address.md) | The owner of the tokens | [packages/actions/src/anvil/AnvilParams.ts:245](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L245) |
| <a id="spender"></a> `spender` | `readonly` | [`Address`](Address.md) | The spender to set the allowance for | [packages/actions/src/anvil/AnvilParams.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L249) |
