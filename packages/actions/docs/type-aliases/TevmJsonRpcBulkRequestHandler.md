[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / TevmJsonRpcBulkRequestHandler

# Type Alias: TevmJsonRpcBulkRequestHandler()

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

request - [CallJsonRpcRequest](CallJsonRpcRequest.md)
response - [CallJsonRpcResponse](CallJsonRpcResponse.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcResponse](GetAccountJsonRpcResponse.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](SetAccountJsonRpcRequest.md)
response - SetAccountJsonRpcResponse

### debug_* methods

#### debug_traceCall

request - DebugTraceCallJsonRpcRequest
response - DebugTraceCallJsonRpcResponse

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

## Parameters

• **requests**: `ReadonlyArray`\<[`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](AnvilJsonRpcRequest.md) \| `DebugJsonRpcRequest`\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`any`\>[]\>

## Defined in

[packages/actions/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts#L94)
