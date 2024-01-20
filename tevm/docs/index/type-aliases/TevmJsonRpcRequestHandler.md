**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > TevmJsonRpcRequestHandler

# Type alias: TevmJsonRpcRequestHandler

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<`JsonRpcReturnTypeFromMethod`\<`TRequest`[`"method"`]\>\>

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

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

### tevm_* methods

#### tevm_call

request - [CallJsonRpcRequest](../../api/type-aliases/CallJsonRpcRequest.md)
response - [CallJsonRpcResponse](../../api/type-aliases/CallJsonRpcResponse.md)

#### tevm_script

request - [ScriptJsonRpcRequest](../../api/type-aliases/ScriptJsonRpcRequest.md)
response - [ScriptJsonRpcResponse](../../api/type-aliases/ScriptJsonRpcResponse.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../api/type-aliases/GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcResponse](../../api/type-aliases/GetAccountJsonRpcResponse.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../api/type-aliases/SetAccountJsonRpcRequest.md)
response - [SetAccountJsonRpcResponse](../../api/type-aliases/SetAccountJsonRpcResponse.md)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../api/type-aliases/DebugTraceCallJsonRpcRequest.md)
response - [DebugTraceCallJsonRpcResponse](../../api/type-aliases/DebugTraceCallJsonRpcResponse.md)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../api/type-aliases/EthBlockNumberJsonRpcRequest.md)
response - [EthBlockNumberJsonRpcResponse](../../api/type-aliases/EthBlockNumberJsonRpcResponse.md)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../api/type-aliases/EthChainIdJsonRpcRequest.md)
response - [EthChainIdJsonRpcResponse](../../api/type-aliases/EthChainIdJsonRpcResponse.md)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../api/type-aliases/EthGetCodeJsonRpcRequest.md)
response - [EthGetCodeJsonRpcResponse](../../api/type-aliases/EthGetCodeJsonRpcResponse.md)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../api/type-aliases/EthGetStorageAtJsonRpcRequest.md)
response - [EthGetStorageAtJsonRpcResponse](../../api/type-aliases/EthGetStorageAtJsonRpcResponse.md)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../api/type-aliases/EthGasPriceJsonRpcRequest.md)
response - [EthGasPriceJsonRpcResponse](../../api/type-aliases/EthGasPriceJsonRpcResponse.md)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../api/type-aliases/EthGetBalanceJsonRpcRequest.md)
response - [EthGetBalanceJsonRpcResponse](../../api/type-aliases/EthGetBalanceJsonRpcResponse.md)

## Source

vm/api/dist/index.d.ts:2368

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
