---
editUrl: false
next: false
prev: false
title: "createJsonRpcFetcher"
---

> **createJsonRpcFetcher**(`url`, `headers`): [`JsonRpcClient`](/reference/tevm/jsonrpc/type-aliases/jsonrpcclient/)

Makes a JSON-RPC request to a url

## Parameters

▪ **url**: `string`

to JSON RPC backend

▪ **headers**: [`HeadersInit`](/reference/tevm/jsonrpc/type-aliases/headersinit/)= `undefined`

to send with the request

## Returns

the `result` field from the JSON-RPC response

## See

https://ethereum.org/en/developers/docs/apis/json-rpc/

## Example

```typescript
const url = 'https://mainnet.optimism.io'
const params = {
  method: 'eth_getBlockByNumber',
  params: ['latest', false],
}
const {result: block} = await fetchJsonRpc(url, params)
```

## Source

[fetchJsonRpc.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpc.js#L17)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
