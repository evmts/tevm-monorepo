---
editUrl: false
next: false
prev: false
title: "createJsonRpcFetcherLegacy"
---

> **createJsonRpcFetcherLegacy**(`url`, `headers`, `retries`?): [`JsonRpcClient`](/reference/tevm/jsonrpc/type-aliases/jsonrpcclient/) & `object`

## Parameters

• **url**: `string`

to JSON RPC backend

• **headers**: [`HeadersInit`](/reference/tevm/jsonrpc/type-aliases/headersinit/) = `...`

to send with the request

• **retries?**: `number` = `3`

defaults to 3

## Returns

[`JsonRpcClient`](/reference/tevm/jsonrpc/type-aliases/jsonrpcclient/) & `object`

the `result` field from the JSON-RPC response

## Defined in

[packages/jsonrpc/src/fetchJsonRpcLegacy.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpcLegacy.js#L20)
