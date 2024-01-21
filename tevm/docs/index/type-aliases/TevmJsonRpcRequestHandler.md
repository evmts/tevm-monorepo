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

request - [CallJsonRpcRequest](../../procedures-types/type-aliases/CallJsonRpcRequest.md)
response - [CallJsonRpcResponse](../../procedures-types/type-aliases/CallJsonRpcResponse.md)

#### tevm_script

request - [ScriptJsonRpcRequest](../../procedures-types/type-aliases/ScriptJsonRpcRequest.md)
response - [ScriptJsonRpcResponse](../../procedures-types/type-aliases/ScriptJsonRpcResponse.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../procedures-types/type-aliases/GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcResponse](../../procedures-types/type-aliases/GetAccountJsonRpcResponse.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../procedures-types/type-aliases/SetAccountJsonRpcRequest.md)
response - [SetAccountJsonRpcResponse](../../procedures-types/type-aliases/SetAccountJsonRpcResponse.md)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../procedures-types/type-aliases/DebugTraceCallJsonRpcRequest.md)
response - [DebugTraceCallJsonRpcResponse](../../procedures-types/type-aliases/DebugTraceCallJsonRpcResponse.md)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../procedures-types/type-aliases/EthBlockNumberJsonRpcRequest.md)
response - [EthBlockNumberJsonRpcResponse](../../procedures-types/type-aliases/EthBlockNumberJsonRpcResponse.md)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../procedures-types/type-aliases/EthChainIdJsonRpcRequest.md)
response - [EthChainIdJsonRpcResponse](../../procedures-types/type-aliases/EthChainIdJsonRpcResponse.md)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../procedures-types/type-aliases/EthGetCodeJsonRpcRequest.md)
response - [EthGetCodeJsonRpcResponse](../../procedures-types/type-aliases/EthGetCodeJsonRpcResponse.md)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../procedures-types/type-aliases/EthGetStorageAtJsonRpcRequest.md)
response - [EthGetStorageAtJsonRpcResponse](../../procedures-types/type-aliases/EthGetStorageAtJsonRpcResponse.md)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../procedures-types/type-aliases/EthGasPriceJsonRpcRequest.md)
response - [EthGasPriceJsonRpcResponse](../../procedures-types/type-aliases/EthGasPriceJsonRpcResponse.md)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../procedures-types/type-aliases/EthGetBalanceJsonRpcRequest.md)
response - [EthGetBalanceJsonRpcResponse](../../procedures-types/type-aliases/EthGetBalanceJsonRpcResponse.md)

## Type parameters

▪ **TRequest** extends [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../procedures-types/type-aliases/EthJsonRpcRequest.md) \| `AnvilJsonRpcRequest` \| `DebugJsonRpcRequest`

## Parameters

▪ **request**: `TRequest`

## Source

packages/procedures-spec/types/TevmJsonRpcRequestHandler.d.ts:234

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
