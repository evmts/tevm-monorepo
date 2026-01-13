[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetErc20AllowanceParams

# Type Alias: AnvilSetErc20AllowanceParams

> **AnvilSetErc20AllowanceParams** = `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:191

Params for `anvil_setErc20Allowance` handler

## Properties

### amount

> `readonly` **amount**: `bigint`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:207

The allowance amount to set

***

### erc20

> `readonly` **erc20**: [`Address`](Address.md)

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:195

The address of the ERC20 token

***

### owner

> `readonly` **owner**: [`Address`](Address.md)

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:199

The owner of the tokens

***

### spender

> `readonly` **spender**: [`Address`](Address.md)

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:203

The spender to set the allowance for
