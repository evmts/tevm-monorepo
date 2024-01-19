**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > TevmJsonRpcRequestHandler

# Type alias: TevmJsonRpcRequestHandler

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<`ReturnType`\<`TRequest`[`"method"`]\>\>

Request handler for JSON-RPC requests. Most users will want to use the `actions` api
instead of this method directly

## Type parameters

▪ **TRequest** extends [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../api/type-aliases/EthJsonRpcRequest.md) \| `AnvilJsonRpcRequest` \| `DebugJsonRpcRequest`

## Parameters

▪ **request**: `TRequest`

## Returns

## Example

```typescript
const blockNumberResponse = await tevm.request({
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
})
const accountResponse = await tevm.request({
 method: 'tevm_getAccount',
 params: [{address: '0x123...'}]
 id: 1
 jsonrpc: '2.0'
})
```

## Source

vm/api/dist/index.d.ts:2215

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
