[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcResponse

# Type Alias: JsonRpcResponse\<TMethod, TResult, TErrorCode\>

> **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\> = \{ `error?`: `never`; `id?`: `string` \| `number` \| `null`; `jsonrpc`: `"2.0"`; `method`: `TMethod`; `result`: `TResult`; \} \| \{ `error`: \{ `code`: `TErrorCode`; `message`: `string`; \}; `id?`: `string` \| `number` \| `null`; `jsonrpc`: `"2.0"`; `method`: `TMethod`; `result?`: `never`; \}

## Type Parameters

| Type Parameter |
| ------ |
| `TMethod` *extends* `string` |
| `TResult` |
| `TErrorCode` *extends* `string` \| `number` |
