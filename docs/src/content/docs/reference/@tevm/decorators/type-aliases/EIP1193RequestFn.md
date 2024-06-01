---
editUrl: false
next: false
prev: false
title: "EIP1193RequestFn"
---

> **EIP1193RequestFn**\<`TRpcSchema`\>: \<`TRpcSchemaOverride`, `TParameters`, `_ReturnType`\>(`args`, `options`?) => `Promise`\<`_ReturnType`\>

## Type parameters

• **TRpcSchema** *extends* [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) \| `undefined` = `undefined`

## Type parameters

• **TRpcSchemaOverride** *extends* [`RpcSchemaOverride`](/reference/tevm/decorators/type-aliases/rpcschemaoverride/) \| `undefined` = `undefined`

• **TParameters** *extends* [`EIP1193Parameters`](/reference/tevm/decorators/type-aliases/eip1193parameters/)\<[`DerivedRpcSchema`](/reference/tevm/decorators/type-aliases/derivedrpcschema/)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> = [`EIP1193Parameters`](/reference/tevm/decorators/type-aliases/eip1193parameters/)\<[`DerivedRpcSchema`](/reference/tevm/decorators/type-aliases/derivedrpcschema/)\<`TRpcSchema`, `TRpcSchemaOverride`\>\>

• **_ReturnType** = [`DerivedRpcSchema`](/reference/tevm/decorators/type-aliases/derivedrpcschema/)\<`TRpcSchema`, `TRpcSchemaOverride`\> *extends* [`RpcSchema`](/reference/tevm/decorators/type-aliases/rpcschema/) ? `Extract`\<[`DerivedRpcSchema`](/reference/tevm/decorators/type-aliases/derivedrpcschema/)\<`TRpcSchema`, `TRpcSchemaOverride`\>\[`number`\], `object`\>\[`"ReturnType"`\] : `unknown`

## Parameters

• **args**: `TParameters`

• **options?**: [`EIP1193RequestOptions`](/reference/tevm/decorators/type-aliases/eip1193requestoptions/)

## Returns

`Promise`\<`_ReturnType`\>

## Source

[eip1193/EIP1993RequestFn.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1993RequestFn.ts#L14)
