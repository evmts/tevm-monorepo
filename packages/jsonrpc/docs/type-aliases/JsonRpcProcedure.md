[**@tevm/jsonrpc**](../README.md) • **Docs**

***

[@tevm/jsonrpc](../globals.md) / JsonRpcProcedure

# Type alias: JsonRpcProcedure()\<TMethod, TParams, TResult, TErrorCode\>

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\>: (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Type parameters

• **TMethod** *extends* `string`

• **TParams**

• **TResult**

• **TErrorCode** *extends* `string` \| `number`

## Parameters

• **request**: [`JsonRpcRequest`](JsonRpcRequest.md)\<`TMethod`, `TParams`\>

## Returns

`Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Source

[packages/jsonrpc/src/JsonRpcProcedure.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcProcedure.ts#L4)
