[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcBulkRequestHandler

# Type alias: TevmJsonRpcBulkRequestHandler()

`Experimental`

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
will be added in the future.

Currently is not very generic with regard to input and output types.

## Example

```typescript
const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
}, {
 method: 'eth_gasPrice',
 params: []
 id: 1
 jsonrpc: '2.0'
}])
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

## Parameters

• **requests**: `ReadonlyArray`\<[`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../procedures-types/type-aliases/EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](../../procedures-types/type-aliases/AnvilJsonRpcRequest.md) \| [`DebugJsonRpcRequest`](../../procedures-types/type-aliases/DebugJsonRpcRequest.md)\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

## Source

packages/procedures-types/dist/index.d.ts:1192
