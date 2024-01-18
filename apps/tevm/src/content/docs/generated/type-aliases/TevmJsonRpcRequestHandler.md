---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcRequestHandler"
---

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<`ReturnType`\<`TRequest`[`"method"`]\>\>

Type of a JSON-RPC request handler for tevm procedures
Generic and returns the correct response type for a given request

## Type parameters

▪ **TRequest** extends [`TevmJsonRpcRequest`](/generated/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/generated/type-aliases/ethjsonrpcrequest/) \| `AnvilJsonRpcRequest` \| `DebugJsonRpcRequest`

## Parameters

▪ **request**: `TRequest`

## Source

[TevmJsonRpcRequestHandler.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L148)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
