[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AccountState

# Type Alias: AccountState

> **AccountState** = `object`

Defined in: [packages/actions/src/common/AccountState.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L6)

The state of an account as captured by `debug_` traces

## Properties

### balance

> `readonly` **balance**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/AccountState.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L7)

***

### code

> `readonly` **code**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/AccountState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L9)

***

### nonce

> `readonly` **nonce**: `number`

Defined in: [packages/actions/src/common/AccountState.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L8)

***

### storage

> `readonly` **storage**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: [packages/actions/src/common/AccountState.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L10)
