[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AccountState

# Type Alias: AccountState

> **AccountState** = `object`

Defined in: [packages/actions/src/common/AccountState.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L6)

The state of an account as captured by `debug_` traces

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="balance"></a> `balance` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/AccountState.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L7) |
| <a id="code"></a> `code` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/AccountState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L9) |
| <a id="nonce"></a> `nonce` | `readonly` | `number` | [packages/actions/src/common/AccountState.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L8) |
| <a id="storage"></a> `storage` | `readonly` | `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\> | [packages/actions/src/common/AccountState.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/AccountState.ts#L10) |
