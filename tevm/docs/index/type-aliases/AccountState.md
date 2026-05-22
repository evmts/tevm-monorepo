[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AccountState

# Type Alias: AccountState

> **AccountState** = `object`

The state of an account as captured by `debug_` traces

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="balance"></a> `balance` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="code"></a> `code` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="nonce"></a> `nonce` | `readonly` | `number` |
| <a id="storage"></a> `storage` | `readonly` | `Record`\<[`Hex`](../../actions/type-aliases/Hex.md), [`Hex`](../../actions/type-aliases/Hex.md)\> |
