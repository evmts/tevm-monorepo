[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcProcedure

# Type Alias: JsonRpcProcedure\<TMethod, TParams, TResult, TErrorCode\>

> **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\> = (`request`) => `Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>

## Type Parameters

| Type Parameter |
| ------ |
| `TMethod` *extends* `string` |
| `TParams` |
| `TResult` |
| `TErrorCode` *extends* `string` \| `number` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`JsonRpcRequest`](JsonRpcRequest.md)\<`TMethod`, `TParams`\> |

## Returns

`Promise`\<[`JsonRpcResponse`](JsonRpcResponse.md)\<`TMethod`, `TResult`, `TErrorCode`\>\>
