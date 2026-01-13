[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L155)

Params for `anvil_setStorageAt` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L159)

The address to set the storage for

***

### position

> `readonly` **position**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L163)

The position in storage to set

***

### value

> `readonly` **value**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L167)

The value to set
