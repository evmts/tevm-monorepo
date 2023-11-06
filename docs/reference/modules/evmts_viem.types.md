[Documentation](../README.md) / [@evmts/viem](evmts_viem.md) / types

# Module: types

## Table of contents

### Type Aliases

- [AnyAsyncFunction](evmts_viem.types.md#anyasyncfunction)
- [AnyFunction](evmts_viem.types.md#anyfunction)
- [AnySyncFunction](evmts_viem.types.md#anysyncfunction)

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

[extensions/viem/src/types.ts:2](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/types.ts#L2)

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

[extensions/viem/src/types.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/types.ts#L1)

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

[extensions/viem/src/types.ts:3](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/types.ts#L3)
