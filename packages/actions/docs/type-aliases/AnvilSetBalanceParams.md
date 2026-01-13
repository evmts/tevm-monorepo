[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetBalanceParams

# Type Alias: AnvilSetBalanceParams

> **AnvilSetBalanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L110)

Params for `anvil_setBalance` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L114)

The address to set the balance for

***

### balance

> `readonly` **balance**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L118)

The balance to set
