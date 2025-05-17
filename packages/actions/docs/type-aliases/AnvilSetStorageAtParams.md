[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L122)

Params for `anvil_setStorageAt` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/anvil/AnvilParams.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L126)

The address to set the storage for

***

### position

> `readonly` **position**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L130)

The position in storage to set

***

### value

> `readonly` **value**: [`Hex`](Hex.md) \| `BigInt`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L134)

The value to set
