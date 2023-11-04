[@evmts/viem](/reference/viem-effect/README.md) / [Modules](/reference/viem-effect/modules.md) / wrapInEffect

# Module: wrapInEffect

## Table of contents

### Type Aliases

- [WrapInEffect](/reference/viem-effect/modules/wrapInEffect.md#wrapineffect)
- [WrappedInEffect](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)

### Functions

- [wrapInEffect](/reference/viem-effect/modules/wrapInEffect.md#wrapineffect-1)

## Type Aliases

### WrapInEffect

Ƭ **WrapInEffect**: \<TViemFunction, TErrorType\>(`viemFunction`: `TViemFunction`) => [`WrappedInEffect`](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Type declaration

▸ \<`TViemFunction`, `TErrorType`\>(`viemFunction`): [`WrappedInEffect`](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](/reference/viem-effect/modules/types.md#anyfunction) |
| `TErrorType` | extends `Error` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `viemFunction` | `TViemFunction` |

##### Returns

[`WrappedInEffect`](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:4](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L4)

___

### WrappedInEffect

Ƭ **WrappedInEffect**\<`TViemFunction`, `TErrorType`\>: \<TParams\>(...`args`: `TParams`) => `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](/reference/viem-effect/modules/types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](/reference/viem-effect/modules/types.md#anyfunction) |
| `TErrorType` | extends `Error` |

#### Type declaration

▸ \<`TParams`\>(`...args`): `Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](/reference/viem-effect/modules/types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Parameters`\<`TViemFunction`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

##### Returns

`Effect.Effect`\<`never`, `TErrorType`, `TViemFunction` extends [`AnyAsyncFunction`](/reference/viem-effect/modules/types.md#anyasyncfunction) ? `Awaited`\<`ReturnType`\<`TViemFunction`\>\> : `ReturnType`\<`TViemFunction`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:11](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L11)

## Functions

### wrapInEffect

▸ **wrapInEffect**\<`TViemFunction`, `TErrorType`\>(`viemFunction`): [`WrappedInEffect`](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TViemFunction` | extends [`AnyFunction`](/reference/viem-effect/modules/types.md#anyfunction) |
| `TErrorType` | extends `Error` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `viemFunction` | `TViemFunction` |

#### Returns

[`WrappedInEffect`](/reference/viem-effect/modules/wrapInEffect.md#wrappedineffect)\<`TViemFunction`, `TErrorType`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:4](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L4)
