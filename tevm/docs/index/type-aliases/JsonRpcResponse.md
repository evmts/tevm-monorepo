[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcResponse

# Type Alias: JsonRpcResponse\<TMethod, TResult, TErrorCode\>

> **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\>: \{ `error`: `never`; `id`: `string` \| `number` \| `null`; `jsonrpc`: `"2.0"`; `method`: `TMethod`; `result`: `TResult`; \} \| \{ `error`: \{ `code`: `TErrorCode`; `message`: `string`; \}; `id`: `string` \| `number` \| `null`; `jsonrpc`: `"2.0"`; `method`: `TMethod`; `result`: `never`; \}

Defined in: packages/jsonrpc/types/JsonRpcResponse.d.ts:1

## Type Parameters

• **TMethod** *extends* `string`

• **TResult**

• **TErrorCode** *extends* `string` \| `number`
