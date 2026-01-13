[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilAddBalanceParams

# Type Alias: AnvilAddBalanceParams

> **AnvilAddBalanceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:289](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L289)

Params for `anvil_addBalance` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:293](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L293)

The address to add balance to

***

### amount

> `readonly` **amount**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:297](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L297)

The amount to add to the balance
