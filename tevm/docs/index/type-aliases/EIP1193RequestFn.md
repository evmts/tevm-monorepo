[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193RequestFn

# Type alias: EIP1193RequestFn()\<TRpcSchema\>

> **EIP1193RequestFn**\<`TRpcSchema`\>: \<`TRpcSchemaOverride`, `TParameters`, `_ReturnType`\>(`args`, `options`?) => `Promise`\<`_ReturnType`\>

## Type parameters

• **TRpcSchema** *extends* [`RpcSchema`](../../decorators/type-aliases/RpcSchema.md) \| `undefined` = `undefined`

## Type parameters

• **TRpcSchemaOverride** *extends* [`RpcSchemaOverride`](../../decorators/type-aliases/RpcSchemaOverride.md) \| `undefined` = `undefined`

• **TParameters** *extends* [`EIP1193Parameters`](../../decorators/type-aliases/EIP1193Parameters.md)\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> = [`EIP1193Parameters`](../../decorators/type-aliases/EIP1193Parameters.md)\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\>

• **_ReturnType** = [`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\> *extends* [`RpcSchema`](../../decorators/type-aliases/RpcSchema.md) ? `Extract`\<[`DerivedRpcSchema`](../../decorators/type-aliases/DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\[`number`\], `object`\>\[`"ReturnType"`\] : `unknown`

## Parameters

• **args**: `TParameters`

• **options?**: [`EIP1193RequestOptions`](../../decorators/type-aliases/EIP1193RequestOptions.md)

## Returns

`Promise`\<`_ReturnType`\>

## Source

packages/decorators/dist/index.d.ts:278
