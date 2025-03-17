[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcBulkRequestHandler

# Type Alias: TevmJsonRpcBulkRequestHandler()

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

Defined in: packages/actions/dist/index.d.ts:4592

**`Experimental`**

Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
will be added in the future.

Currently is not very generic with regard to input and output types.

## Parameters

### requests

`ReadonlyArray`\<[`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../actions/type-aliases/EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](../../actions/type-aliases/AnvilJsonRpcRequest.md) \| `DebugJsonRpcRequest`\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

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

request - [CallJsonRpcRequest](../../actions/type-aliases/CallJsonRpcRequest.md)
response - [CallJsonRpcResponse](../../actions/type-aliases/CallJsonRpcResponse.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../actions/type-aliases/GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcResponse](../../actions/type-aliases/GetAccountJsonRpcResponse.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../actions/type-aliases/SetAccountJsonRpcRequest.md)
response - SetAccountJsonRpcResponse

### debug_* methods

#### debug_traceCall

request - DebugTraceCallJsonRpcRequest
response - DebugTraceCallJsonRpcResponse

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../actions/type-aliases/EthBlockNumberJsonRpcRequest.md)
response - [EthBlockNumberJsonRpcResponse](../../actions/type-aliases/EthBlockNumberJsonRpcResponse.md)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../actions/type-aliases/EthChainIdJsonRpcRequest.md)
response - [EthChainIdJsonRpcResponse](../../actions/type-aliases/EthChainIdJsonRpcResponse.md)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../actions/type-aliases/EthGetCodeJsonRpcRequest.md)
response - [EthGetCodeJsonRpcResponse](../../actions/type-aliases/EthGetCodeJsonRpcResponse.md)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../actions/type-aliases/EthGetStorageAtJsonRpcRequest.md)
response - [EthGetStorageAtJsonRpcResponse](../../actions/type-aliases/EthGetStorageAtJsonRpcResponse.md)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../actions/type-aliases/EthGasPriceJsonRpcRequest.md)
response - [EthGasPriceJsonRpcResponse](../../actions/type-aliases/EthGasPriceJsonRpcResponse.md)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../actions/type-aliases/EthGetBalanceJsonRpcRequest.md)
response - [EthGetBalanceJsonRpcResponse](../../actions/type-aliases/EthGetBalanceJsonRpcResponse.md)
