[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcRequest

# Type Alias: JsonRpcRequest\<TMethod, TParams\>

> **JsonRpcRequest**\<`TMethod`, `TParams`\> = `object` & `TParams` *extends* readonly \[\] ? `object` : `object`

Defined in: packages/jsonrpc/types/JsonRpcRequest.d.ts:4

Helper type for creating JSON-RPC request types

## Type Declaration

### id?

> `readonly` `optional` **id**: `string` \| `number` \| `null`

### jsonrpc

> `readonly` **jsonrpc**: `"2.0"`

### method

> `readonly` **method**: `TMethod`

## Type Parameters

### TMethod

`TMethod` *extends* `string`

### TParams

`TParams`
