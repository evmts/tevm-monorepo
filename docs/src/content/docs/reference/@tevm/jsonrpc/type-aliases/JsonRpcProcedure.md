---
editUrl: false
next: false
prev: false
title: "JsonRpcProcedure"
---

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\>: (`request`) => `Promise`\<[`JsonRpcResponse`](/reference/tevm/jsonrpc/type-aliases/jsonrpcresponse/)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Type Parameters

• **TMethod** *extends* `string`

• **TParams**

• **TResult**

• **TErrorCode** *extends* `string` \| `number`

## Parameters

• **request**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`TMethod`, `TParams`\>

## Returns

`Promise`\<[`JsonRpcResponse`](/reference/tevm/jsonrpc/type-aliases/jsonrpcresponse/)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Defined in

[packages/jsonrpc/src/JsonRpcProcedure.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcProcedure.ts#L4)
