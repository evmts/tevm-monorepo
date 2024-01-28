**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > TevmJsonRpcRequestHandler

# Type alias: TevmJsonRpcRequestHandler

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`[`"method"`]\>\>

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

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

request - CallJsonRpcRequest
response - CallJsonRpcResponse

#### tevm_script

request - ScriptJsonRpcRequest
response - ScriptJsonRpcResponse

#### tevm_getAccount

request - GetAccountJsonRpcRequest
response - GetAccountJsonRpcResponse

#### tevm_setAccount

request - SetAccountJsonRpcRequest
response - SetAccountJsonRpcResponse

#### tevm_fork

request - ForkJsonRpcRequest
response - ForkJsonRpcResponse

### debug_* methods

#### debug_traceCall

request - DebugTraceCallJsonRpcRequest
response - DebugTraceCallJsonRpcResponse

### eth_* methods

#### eth_blockNumber

request - EthBlockNumberJsonRpcRequest
response - EthBlockNumberJsonRpcResponse

#### eth_chainId

request - EthChainIdJsonRpcRequest
response - EthChainIdJsonRpcResponse

#### eth_getCode

request - EthGetCodeJsonRpcRequest
response - EthGetCodeJsonRpcResponse

#### eth_getStorageAt

request - EthGetStorageAtJsonRpcRequest
response - EthGetStorageAtJsonRpcResponse

#### eth_gasPrice

request - EthGasPriceJsonRpcRequest
response - EthGasPriceJsonRpcResponse

#### eth_getBalance

request - EthGetBalanceJsonRpcRequest
response - EthGetBalanceJsonRpcResponse

## Type parameters

▪ **TRequest** extends [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../procedures-types/type-aliases/EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](../../procedures-types/type-aliases/AnvilJsonRpcRequest.md) \| [`DebugJsonRpcRequest`](../../procedures-types/type-aliases/DebugJsonRpcRequest.md)

## Parameters

▪ **request**: `TRequest`

## Source

packages/procedures-types/types/tevm-request-handler/TevmJsonRpcRequestHandler.d.ts:89

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
