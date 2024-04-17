**@tevm/viem-effect** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/viem-effect](../../README.md) / [wrapInEffect](../README.md) / WrappedInEffect

# Type alias: WrappedInEffect()\<TViemFunction, TErrorType\>

> **WrappedInEffect**\<`TViemFunction`, `TErrorType`\>: \<`TParams`\>(...`args`) => `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](../../types/type-aliases/AnyAsyncFunction.md) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

## Type parameters

• **TViemFunction** extends [`AnyFunction`](../../types/type-aliases/AnyFunction.md)

• **TErrorType** extends `Error`

## Type parameters

• **TParams** extends `Parameters`\<`TViemFunction`\>

## Parameters

• ...**args**: `TParams`

## Returns

`Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](../../types/type-aliases/AnyAsyncFunction.md) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

## Source

[experimental/viem-effect/src/wrapInEffect.d.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/wrapInEffect.d.ts#L11)
