[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / JsonRpcRequest

# Type Alias: JsonRpcRequest\<TMethod, TParams\>

> **JsonRpcRequest**\<`TMethod`, `TParams`\> = `object` & `TParams` *extends* readonly \[\] ? `object` : `object`

Defined in: packages/jsonrpc/src/JsonRpcRequest.ts:4

Helper type for creating JSON-RPC request types

## Type declaration

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
