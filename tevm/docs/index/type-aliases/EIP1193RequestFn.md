[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193RequestFn

# Type Alias: EIP1193RequestFn\<TRpcSchema\>

> **EIP1193RequestFn**\<`TRpcSchema`\> = \<`TRpcSchemaOverride`, `TParameters`, `_ReturnType`\>(`args`, `options?`) => `Promise`\<`_ReturnType`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TRpcSchema` *extends* [`RpcSchema`](../../decorators/type-aliases/RpcSchema.md) \| `undefined` | `undefined` |

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TRpcSchemaOverride` *extends* [`RpcSchemaOverride`](../../decorators/type-aliases/RpcSchemaOverride.md) \| `undefined` | `undefined` |
| `TParameters` *extends* [`EIP1193Parameters`](../../decorators/type-aliases/EIP1193Parameters.md)\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> | [`EIP1193Parameters`](../../decorators/type-aliases/EIP1193Parameters.md)\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> |
| `_ReturnType` | [`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\> *extends* [`RpcSchema`](../../decorators/type-aliases/RpcSchema.md) ? `Extract`\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\[`number`\], \{ `Method`: `TParameters`\[`"method"`\]; \}\>\[`"ReturnType"`\] : `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `TParameters` |
| `options?` | [`EIP1193RequestOptions`](../../decorators/type-aliases/EIP1193RequestOptions.md) |

## Returns

`Promise`\<`_ReturnType`\>
