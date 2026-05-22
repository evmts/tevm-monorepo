[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetErc20AllowanceParams

# Type Alias: AnvilSetErc20AllowanceParams

> **AnvilSetErc20AllowanceParams** = `object`

Params for `anvil_setErc20Allowance` handler

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="amount"></a> `amount` | `readonly` | `bigint` | The allowance amount to set |
| <a id="erc20"></a> `erc20` | `readonly` | [`Address`](Address.md) | The address of the ERC20 token |
| <a id="owner"></a> `owner` | `readonly` | [`Address`](Address.md) | The owner of the tokens |
| <a id="spender"></a> `spender` | `readonly` | [`Address`](Address.md) | The spender to set the allowance for |
