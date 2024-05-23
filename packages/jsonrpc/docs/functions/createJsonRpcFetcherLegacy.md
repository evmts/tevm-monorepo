[**@tevm/jsonrpc**](../README.md) • **Docs**

***

[@tevm/jsonrpc](../globals.md) / createJsonRpcFetcherLegacy

# Function: createJsonRpcFetcherLegacy()

> **createJsonRpcFetcherLegacy**(`url`, `headers`, `retries`?): [`JsonRpcClient`](../type-aliases/JsonRpcClient.md) & `object`

Makes a JSON-RPC request to a url

## Parameters

• **url**: `string`

to JSON RPC backend

• **headers**: [`HeadersInit`](../type-aliases/HeadersInit.md)= `undefined`

to send with the request

• **retries?**: `number`= `3`

defaults to 3

## Returns

[`JsonRpcClient`](../type-aliases/JsonRpcClient.md) & `object`

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

[packages/jsonrpc/src/fetchJsonRpcLegacy.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpcLegacy.js#L20)
