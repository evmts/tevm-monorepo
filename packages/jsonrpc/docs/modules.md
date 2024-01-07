[@tevm/jsonrpc](README.md) / Exports

# @tevm/jsonrpc

## Table of contents

### Functions

- [createJsonRpcFetcher](modules.md#createjsonrpcfetcher)

## Functions

### createJsonRpcFetcher

▸ **createJsonRpcFetcher**(`url`): `JsonRpcClient`

Makes a JSON-RPC request to a url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | to JSON RPC backend |

#### Returns

`JsonRpcClient`

the `result` field from the JSON-RPC response

**`See`**

https://ethereum.org/en/developers/docs/apis/json-rpc/

**`Example`**

```typescript
const url = 'https://mainnet.optimism.io'
const params = {
  method: 'eth_getBlockByNumber',
  params: ['latest', false],
}
const {result: block} = await fetchJsonRpc(url, params)

#### Defined in

[fetchJsonRpc.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpc.js#L19)
