**@tevm/jsonrpc** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcProcedure

# Type alias: JsonRpcProcedure`<TMethod, TParams, TResult, TErrorCode>`

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\>: (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends `string` |
| `TParams` |
| `TResult` |
| `TErrorCode` extends `string` |

## Parameters

▪ **request**: [`JsonRpcRequest`](JsonRpcRequest.md)\<`TMethod`, `TParams`\>

## Source

JsonRpcProcedure.ts:4

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
