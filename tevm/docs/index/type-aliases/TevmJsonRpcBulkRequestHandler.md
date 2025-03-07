[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcBulkRequestHandler

# Type Alias: TevmJsonRpcBulkRequestHandler()

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

Defined in: packages/actions/types/tevm-request-handler/TevmJsonRpcBulkRequestHandler.d.ts:85

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

request - CallJsonRpcRequest
response - CallJsonRpcResponse

#### tevm_getAccount

request - GetAccountJsonRpcRequest
response - GetAccountJsonRpcResponse

#### tevm_setAccount

request - SetAccountJsonRpcRequest
response - SetAccountJsonRpcResponse

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
