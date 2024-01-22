---
editUrl: false
next: false
prev: false
title: "JsonRpcRequest"
---

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

[JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcRequest.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
