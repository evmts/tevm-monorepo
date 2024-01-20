**@tevm/viem-effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [wrapInEffect](../README.md) > WrappedInEffect

# Type alias: WrappedInEffect`<TViemFunction, TErrorType>`

> **WrappedInEffect**\<`TViemFunction`, `TErrorType`\>: \<`TParams`\>(...`args`) => `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](../../types/type-aliases/AnyAsyncFunction.md) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

## Type parameters

| Parameter |
| :------ |
| `TViemFunction` extends [`AnyFunction`](../../types/type-aliases/AnyFunction.md) |
| `TErrorType` extends `Error` |

## Type parameters

▪ **TParams** extends `Parameters`\<`TViemFunction`\>

## Parameters

▪ ...**args**: `TParams`

## Source

[src/wrapInEffect.d.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/viem-effect/src/wrapInEffect.d.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
