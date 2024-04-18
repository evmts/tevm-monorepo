**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / JsonRpcRequest

# Type alias: JsonRpcRequest\<TMethod, TParams\>

> **JsonRpcRequest**\<`TMethod`, `TParams`\>: `object` & `TParams` extends readonly [] ? `object` : `object`

Helper type for creating JSON-RPC request types

## Type declaration

### id?

> **`optional`** **`readonly`** **id**: `string` \| `number` \| `null`

### jsonrpc

> **`readonly`** **jsonrpc**: `"2.0"`

### method

> **`readonly`** **method**: `TMethod`

## Type parameters

• **TMethod** extends `string`

• **TParams**

## Source

packages/jsonrpc/types/JsonRpcRequest.d.ts:4
