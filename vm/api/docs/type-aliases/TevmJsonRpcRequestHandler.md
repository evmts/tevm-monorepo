**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TevmJsonRpcRequestHandler

# Type alias: TevmJsonRpcRequestHandler

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`[`"method"`]\>\>

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

## Type parameters

▪ **TRequest** extends [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](EthJsonRpcRequest.md) \| `AnvilJsonRpcRequest` \| `DebugJsonRpcRequest`

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

request - [CallJsonRpcRequest](CallJsonRpcRequest.md)
response - [CallJsonRpcRequest](CallJsonRpcRequest.md)

#### tevm_script

request - [ScriptJsonRpcRequest](ScriptJsonRpcRequest.md)
response - [ScriptJsonRpcRequest](ScriptJsonRpcRequest.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcRequest](GetAccountJsonRpcRequest.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](SetAccountJsonRpcRequest.md)
response - [SetAccountJsonRpcRequest](SetAccountJsonRpcRequest.md)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](DebugTraceCallJsonRpcRequest.md)
response - [DebugTraceCallJsonRpcResponse](DebugTraceCallJsonRpcResponse.md)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](EthBlockNumberJsonRpcRequest.md)
response - [EthBlockNumberJsonRpcResponse](EthBlockNumberJsonRpcResponse.md)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](EthChainIdJsonRpcRequest.md)
response - [EthChainIdJsonRpcResponse](EthChainIdJsonRpcResponse.md)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](EthGetCodeJsonRpcRequest.md)
response - [EthGetCodeJsonRpcResponse](EthGetCodeJsonRpcResponse.md)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](EthGetStorageAtJsonRpcRequest.md)
response - [EthGetStorageAtJsonRpcResponse](EthGetStorageAtJsonRpcResponse.md)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](EthGasPriceJsonRpcRequest.md)
response - [EthGasPriceJsonRpcResponse](EthGasPriceJsonRpcResponse.md)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](EthGetBalanceJsonRpcRequest.md)
response - [EthGetBalanceJsonRpcResponse](EthGetBalanceJsonRpcResponse.md)

## Source

[TevmJsonRpcRequestHandler.ts:376](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/TevmJsonRpcRequestHandler.ts#L376)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
