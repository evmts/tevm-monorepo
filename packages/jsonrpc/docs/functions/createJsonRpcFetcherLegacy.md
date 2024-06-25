[**@tevm/jsonrpc**](../README.md) • **Docs**

***

[@tevm/jsonrpc](../globals.md) / createJsonRpcFetcherLegacy

# Function: createJsonRpcFetcherLegacy()

> **createJsonRpcFetcherLegacy**(`url`, `headers`, `retries`?): [`JsonRpcClient`](../type-aliases/JsonRpcClient.md) & `object`

## Parameters

• **url**: `string`

to JSON RPC backend

• **headers**: [`HeadersInit`](../type-aliases/HeadersInit.md) = `...`

to send with the request

• **retries?**: `number` = `3`

defaults to 3

## Returns

[`JsonRpcClient`](../type-aliases/JsonRpcClient.md) & `object`

the `result` field from the JSON-RPC response

## Defined in

[packages/jsonrpc/src/fetchJsonRpcLegacy.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpcLegacy.js#L20)
