[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / dumpStateHandler

# Function: dumpStateHandler()

> **dumpStateHandler**(`client`, `options`?): [`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM client instance.

• **options?** = `{}`

Optional settings.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error if the state dump fails.

## Returns

[`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

- The state dump handler function.

## Defined in

[packages/actions/src/DumpState/dumpStateHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/dumpStateHandler.js#L32)
