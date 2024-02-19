[@tevm/jsonrpc](README.md) / Exports

# @tevm/jsonrpc

## Table of contents

### Type Aliases

- [HeadersInit](modules.md#headersinit)
- [JsonRpcClient](modules.md#jsonrpcclient)
- [JsonRpcProcedure](modules.md#jsonrpcprocedure)
- [JsonRpcRequest](modules.md#jsonrpcrequest)
- [JsonRpcResponse](modules.md#jsonrpcresponse)

### Functions

- [createJsonRpcFetcher](modules.md#createjsonrpcfetcher)

## Type Aliases

### HeadersInit

Ƭ **HeadersInit**: `string`[][] \| `Record`\<`string`, `string` \| `ReadonlyArray`\<`string`\>\> \| `Headers`

The headers interface of the Fetch API

#### Defined in

[HeadersInit.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/HeadersInit.ts#L4)

___

### JsonRpcClient

Ƭ **JsonRpcClient**: `Object`

A client for making JsonRpc requests over http

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`JsonRpcProcedure`](modules.md#jsonrpcprocedure)\<`string`, `unknown`, `unknown`, `string`\> |
| `url` | `string` |

#### Defined in

[JsonRpcClient.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcClient.ts#L6)

___

### JsonRpcProcedure

Ƭ **JsonRpcProcedure**\<`TMethod`, `TParams`, `TResult`, `TErrorCode`\>: (`request`: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<`TMethod`, `TParams`\>) => `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<`TMethod`, `TResult`, `TErrorCode`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |

#### Type declaration

▸ (`request`): `Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<`TMethod`, `TResult`, `TErrorCode`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<`TMethod`, `TParams`\> |

##### Returns

`Promise`\<[`JsonRpcResponse`](modules.md#jsonrpcresponse)\<`TMethod`, `TResult`, `TErrorCode`\>\>

#### Defined in

[JsonRpcProcedure.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcProcedure.ts#L4)

___

### JsonRpcRequest

Ƭ **JsonRpcRequest**\<`TMethod`, `TParams`\>: \{ `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod`  } & `TParams` extends readonly [] ? \{ `params?`: `TParams`  } : \{ `params`: `TParams`  }

Helper type for creating JSON-RPC request types

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TParams` | `TParams` |

#### Defined in

[JsonRpcRequest.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcRequest.ts#L4)

___

### JsonRpcResponse

Ƭ **JsonRpcResponse**\<`TMethod`, `TResult`, `TErrorCode`\>: \{ `error?`: `never` ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result`: `TResult`  } \| \{ `error`: \{ `code`: `TErrorCode` ; `message`: `string`  } ; `id?`: `string` \| `number` \| ``null`` ; `jsonrpc`: ``"2.0"`` ; `method`: `TMethod` ; `result?`: `never`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMethod` | extends `string` |
| `TResult` | `TResult` |
| `TErrorCode` | extends `string` |

#### Defined in

[JsonRpcResponse.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/JsonRpcResponse.ts#L1)

## Functions

### createJsonRpcFetcher

▸ **createJsonRpcFetcher**(`url`, `headers?`): [`JsonRpcClient`](modules.md#jsonrpcclient)

Makes a JSON-RPC request to a url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | to JSON RPC backend |
| `headers` | [`HeadersInit`](modules.md#headersinit) | to send with the request |

#### Returns

[`JsonRpcClient`](modules.md#jsonrpcclient)

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
```

#### Defined in

[fetchJsonRpc.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/jsonrpc/src/fetchJsonRpc.js#L17)
