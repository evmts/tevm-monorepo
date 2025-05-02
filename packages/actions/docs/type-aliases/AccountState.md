[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AccountState

# Type Alias: AccountState

> **AccountState**: `object`

Defined in: [packages/actions/src/common/AccountState.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L6)

The state of an account as captured by `debug_` traces

## Type declaration

### balance

> `readonly` **balance**: [`Hex`](Hex.md)

### code

> `readonly` **code**: [`Hex`](Hex.md)

### nonce

> `readonly` **nonce**: `number`

### storage

> `readonly` **storage**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>
