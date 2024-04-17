**@tevm/jsonrpc** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/jsonrpc](../README.md) / createJsonRpcFetcher

# Function: createJsonRpcFetcher()

> **createJsonRpcFetcher**(`url`, `headers`): [`JsonRpcClient`](../type-aliases/JsonRpcClient.md)

Makes a JSON-RPC request to a url

## Parameters

• **url**: `string`

to JSON RPC backend

• **headers**: [`HeadersInit`](../type-aliases/HeadersInit.md)= `undefined`

to send with the request

## Returns

[`JsonRpcClient`](../type-aliases/JsonRpcClient.md)

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
