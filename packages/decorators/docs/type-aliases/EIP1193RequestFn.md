[**@tevm/decorators**](../README.md) • **Docs**

***

[@tevm/decorators](../globals.md) / EIP1193RequestFn

# Type alias: EIP1193RequestFn()\<TRpcSchema\>

> **EIP1193RequestFn**\<`TRpcSchema`\>: \<`TRpcSchemaOverride`, `TParameters`, `_ReturnType`\>(`args`, `options`?) => `Promise`\<`_ReturnType`\>

## Type parameters

• **TRpcSchema** *extends* [`RpcSchema`](RpcSchema.md) \| `undefined` = `undefined`

## Type parameters

• **TRpcSchemaOverride** *extends* [`RpcSchemaOverride`](RpcSchemaOverride.md) \| `undefined` = `undefined`

• **TParameters** *extends* [`EIP1193Parameters`](EIP1193Parameters.md)\<[`DerivedRpcSchema`](DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> = [`EIP1193Parameters`](EIP1193Parameters.md)\<[`DerivedRpcSchema`](DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\>

• **_ReturnType** = [`DerivedRpcSchema`](DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\> *extends* [`RpcSchema`](RpcSchema.md) ? `Extract`\<[`DerivedRpcSchema`](DerivedRpcSchema.md)\<`TRpcSchema`, `TRpcSchemaOverride`\>\[`number`\], `object`\>\[`"ReturnType"`\] : `unknown`

## Parameters

• **args**: `TParameters`

• **options?**: [`EIP1193RequestOptions`](EIP1193RequestOptions.md)

## Returns

`Promise`\<`_ReturnType`\>

## Source

[eip1193/EIP1993RequestFn.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1993RequestFn.ts#L14)
