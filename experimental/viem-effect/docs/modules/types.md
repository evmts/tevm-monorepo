[@tevm/viem-effect](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [AnyAsyncFunction](types.md#anyasyncfunction)
- [AnyFunction](types.md#anyfunction)
- [AnySyncFunction](types.md#anysyncfunction)

## Type Aliases

### AnyAsyncFunction

Ƭ **AnyAsyncFunction**: (...`args`: `any`[]) => `Promise`\<`any`\>

#### Type declaration

▸ (`...args`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`\<`any`\>

#### Defined in

[experimental/viem-effect/src/types.ts:2](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/types.ts#L2)

___

### AnyFunction

Ƭ **AnyFunction**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (`...args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[experimental/viem-effect/src/types.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/types.ts#L1)

___

### AnySyncFunction

Ƭ **AnySyncFunction**: (...`args`: `any`[]) => `Exclude`\<`any`, `Promise`\<`any`\>\>

#### Type declaration

▸ (`...args`): `Exclude`\<`any`, `Promise`\<`any`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Exclude`\<`any`, `Promise`\<`any`\>\>

#### Defined in

[experimental/viem-effect/src/types.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/types.ts#L3)
