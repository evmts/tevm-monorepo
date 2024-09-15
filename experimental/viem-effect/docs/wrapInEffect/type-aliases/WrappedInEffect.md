[**@tevm/viem-effect**](../../README.md) • **Docs**

***

[@tevm/viem-effect](../../modules.md) / [wrapInEffect](../README.md) / WrappedInEffect

# Type Alias: WrappedInEffect()\<TViemFunction, TErrorType\>

> **WrappedInEffect**\<`TViemFunction`, `TErrorType`\>: \<`TParams`\>(...`args`) => `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` *extends* [`AnyAsyncFunction`](../../types/type-aliases/AnyAsyncFunction.md) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

## Type Parameters

• **TViemFunction** *extends* [`AnyFunction`](../../types/type-aliases/AnyFunction.md)

• **TErrorType** *extends* `Error`

## Type Parameters

• **TParams** *extends* `Parameters`\<`TViemFunction`\>

## Parameters

• ...**args**: `TParams`

## Returns

`Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` *extends* [`AnyAsyncFunction`](../../types/type-aliases/AnyAsyncFunction.md) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

## Defined in

[experimental/viem-effect/src/wrapInEffect.d.ts:11](https://github.com/qbzzt/tevm-monorepo/blob/main/experimental/viem-effect/src/wrapInEffect.d.ts#L11)
