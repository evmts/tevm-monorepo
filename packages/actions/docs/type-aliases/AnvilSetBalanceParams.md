[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetBalanceParams

# Type Alias: AnvilSetBalanceParams

> **AnvilSetBalanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L77)

Params for `anvil_setBalance` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L81)

The address to set the balance for

***

### balance

> `readonly` **balance**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L85)

The balance to set
