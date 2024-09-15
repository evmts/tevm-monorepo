[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / loadStateHandler

# Function: loadStateHandler()

> **loadStateHandler**(`client`, `options`?): [`LoadStateHandler`](../type-aliases/LoadStateHandler.md)

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The base client instance.

• **options?** = `{}`

Optional configuration.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error when a failure occurs.

## Returns

[`LoadStateHandler`](../type-aliases/LoadStateHandler.md)

- The handler function.

## Defined in

[packages/actions/src/LoadState/loadStateHandler.js:35](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/LoadState/loadStateHandler.js#L35)
