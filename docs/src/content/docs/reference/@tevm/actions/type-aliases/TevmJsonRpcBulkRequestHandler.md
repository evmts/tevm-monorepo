---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcBulkRequestHandler"
---

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/actions/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
will be added in the future.

Currently is not very generic with regard to input and output types.

## Parameters

• **requests**: `ReadonlyArray`\<[`TevmJsonRpcRequest`](/reference/tevm/actions/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/actions/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/actions/type-aliases/anviljsonrpcrequest/) \| `DebugJsonRpcRequest`\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/actions/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

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

request - [CallJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/calljsonrpcrequest)
response - [CallJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/calljsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/setaccountjsonrpcrequest)
response - SetAccountJsonRpcResponse

### debug_* methods

#### debug_traceCall

request - DebugTraceCallJsonRpcRequest
response - DebugTraceCallJsonRpcResponse

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../../../../../../reference/tevm/actions/type-aliases/ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](../../../../../../../reference/tevm/actions/type-aliases/ethgetbalancejsonrpcresponse)

## Defined in

[packages/actions/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts#L94)
