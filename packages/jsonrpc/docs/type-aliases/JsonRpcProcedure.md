[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / JsonRpcProcedure

# Type Alias: JsonRpcProcedure()\<TMethod, TParams, TResult, TErrorCode\>

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\> = (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

Defined in: packages/jsonrpc/src/JsonRpcProcedure.ts:4

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
