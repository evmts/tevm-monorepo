[**@tevm/jsonrpc**](../README.md) • **Docs**

***

[@tevm/jsonrpc](../globals.md) / JsonRpcRequest

# Type alias: JsonRpcRequest\<TMethod, TParams\>

> **JsonRpcRequest**\<`TMethod`, `TParams`\>: `object` & `TParams` *extends* readonly [] ? `object` : `object`

Helper type for creating JSON-RPC request types

## Type declaration

### id?

> `optional` `readonly` **id**: `string` \| `number` \| `null`

### jsonrpc

> `readonly` **jsonrpc**: `"2.0"`

### method

> `readonly` **method**: `TMethod`

## Type parameters

• **TMethod** *extends* `string`

• **TParams**

## Source

[JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcRequest.ts#L4)
