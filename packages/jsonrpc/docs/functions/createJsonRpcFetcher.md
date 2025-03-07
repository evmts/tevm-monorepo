[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / createJsonRpcFetcher

# Function: ~~createJsonRpcFetcher()~~

> **createJsonRpcFetcher**(`client`): [`JsonRpcClient`](../type-aliases/JsonRpcClient.md)

Defined in: [packages/jsonrpc/src/createJsonRpcFetcher.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/createJsonRpcFetcher.js#L19)

## Parameters

### client

#### request

`EIP1193RequestFn`\<`undefined`\>

## Returns

[`JsonRpcClient`](../type-aliases/JsonRpcClient.md)

the `result` field from the JSON-RPC response

## Deprecated

Makes a JSON-RPC request to a url
Returns the entire JSON-RPC response rather than throwing and only returning result
Used currently as an adapter to avoid refactoring existing code

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
