[@tevm/viem-effect](../README.md) / [Modules](../modules.md) / wrapInEffect

# Module: wrapInEffect

## Table of contents

### Type Aliases

- [WrapInEffect](wrapInEffect.md#wrapineffect)
- [WrappedInEffect](wrapInEffect.md#wrappedineffect)

### Functions

- [wrapInEffect](wrapInEffect.md#wrapineffect-1)

## Type Aliases

### WrapInEffect

Ƭ **WrapInEffect**: \<TViemFunction, TErrorType\>(`viemFunction`: `TViemFunction`) => [`WrappedInEffect`](wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Type declaration

▸ \<`TViemFunction`, `TErrorType`\>(`viemFunction`): [`WrappedInEffect`](wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](types.md#anyfunction) |
| `TErrorType` | extends `Error` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `viemFunction` | `TViemFunction` |

##### Returns

[`WrappedInEffect`](wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Defined in

[experimental/viem-effect/src/wrapInEffect.d.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/wrapInEffect.d.ts#L4)

___

### WrappedInEffect

Ƭ **WrappedInEffect**\<`TViemFunction`, `TErrorType`\>: \<TParams\>(...`args`: `TParams`) => `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](types.md#anyfunction) |
| `TErrorType` | extends `Error` |

#### Type declaration

▸ \<`TParams`\>(`...args`): `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Parameters`\<`TViemFunction`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

##### Returns

`Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

#### Defined in

[experimental/viem-effect/src/wrapInEffect.d.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/wrapInEffect.d.ts#L11)

## Functions

### wrapInEffect

▸ **wrapInEffect**\<`TViemFunction`, `TErrorType`\>(`viemFunction`): [`WrappedInEffect`](wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](types.md#anyfunction) |
| `TErrorType` | extends `Error` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `viemFunction` | `TViemFunction` |

#### Returns

[`WrappedInEffect`](wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Defined in

[experimental/viem-effect/src/wrapInEffect.d.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/wrapInEffect.d.ts#L24)
