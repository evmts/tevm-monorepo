[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AccountState

# Type Alias: AccountState

> **AccountState**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L31)

The state of an account as captured by the prestateTracer

## Type declaration

### balance

> `readonly` **balance**: [`Hex`](Hex.md)

### code

> `readonly` **code**: [`Hex`](Hex.md)

### nonce

> `readonly` **nonce**: `string`

### storage

> `readonly` **storage**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>
