[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / callHandler

# Function: callHandler()

> **callHandler**(`client`, `options`?): [`CallHandler`](../type-aliases/CallHandler.md)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`CallHandler`](../type-aliases/CallHandler.md)

The call handler function.

## Defined in

[packages/actions/src/Call/callHandler.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandler.js#L45)
