[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcProcedure

# Type Alias: JsonRpcProcedure()\<TMethod, TParams, TResult, TErrorCode\>

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\> = (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

Defined in: packages/jsonrpc/types/JsonRpcProcedure.d.ts:3

## Type Parameters

### TMethod

`TMethod` *extends* `string`

### TParams

`TParams`

### TResult

`TResult`

### TErrorCode

`TErrorCode` *extends* `string` \| `number`

## Parameters

### request

[`JsonRpcRequest`](JsonRpcRequest.md)\<`TMethod`, `TParams`\>

## Returns

`Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>
