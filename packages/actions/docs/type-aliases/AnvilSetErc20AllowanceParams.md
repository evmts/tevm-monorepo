[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetErc20AllowanceParams

# Type Alias: AnvilSetErc20AllowanceParams

> **AnvilSetErc20AllowanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:232](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L232)

Params for `anvil_setErc20Allowance` handler

## Properties

### amount

> `readonly` **amount**: `bigint`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:248](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L248)

The allowance amount to set

***

### erc20

> `readonly` **erc20**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L236)

The address of the ERC20 token

***

### owner

> `readonly` **owner**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L240)

The owner of the tokens

***

### spender

> `readonly` **spender**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L244)

The spender to set the allowance for
