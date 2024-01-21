**@tevm/procedures-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcRequest

# Type alias: JsonRpcRequest`<TMethod, TParams>`

> **JsonRpcRequest**\<`TMethod`, `TParams`\>: `object` & `TParams` extends readonly [] ? `object` : `object`

Helper type for creating JSON-RPC request types

## Type declaration

### id

> **id**?: `string` \| `number` \| `null`

### jsonrpc

> **jsonrpc**: `"2.0"`

### method

> **method**: `TMethod`

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends `string` |
| `TParams` |

## Source

[requests/JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/core/procedures-spec/src/requests/JsonRpcRequest.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
