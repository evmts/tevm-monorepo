[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / getAccountHandler

# Function: getAccountHandler()

> **getAccountHandler**(`client`, `options?`): [`GetAccountHandler`](../type-aliases/GetAccountHandler.md)

Defined in: [packages/actions/src/GetAccount/getAccountHandler.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/getAccountHandler.js#L17)

Creates a GetAccountHandler for handling account params with the Tevm VM.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `options?` | \{ `throwOnFail?`: `boolean`; \} | - |
| `options.throwOnFail?` | `boolean` | whether to default to throwing or not when errors occur |

## Returns

[`GetAccountHandler`](../type-aliases/GetAccountHandler.md)
