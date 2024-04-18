**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / JsonRpcProcedure

# Type alias: JsonRpcProcedure()\<TMethod, TParams, TResult, TErrorCode\>

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\>: (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Type parameters

• **TMethod** extends `string`

• **TParams**

• **TResult**

• **TErrorCode** extends `string`

## Parameters

• **request**: [`JsonRpcRequest`](JsonRpcRequest.md)\<`TMethod`, `TParams`\>

## Returns

`Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Source

packages/jsonrpc/types/JsonRpcProcedure.d.ts:3
