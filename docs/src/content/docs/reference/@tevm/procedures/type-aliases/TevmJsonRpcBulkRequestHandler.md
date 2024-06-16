---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcBulkRequestHandler"
---

`Experimental`

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

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

request - [CallJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/calljsonrpcrequest)
response - [CallJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/calljsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/setaccountjsonrpcrequest)
response - [SetAccountJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/setaccountjsonrpcresponse)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/debugtracecalljsonrpcrequest)
response - [DebugTraceCallJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/debugtracecalljsonrpcresponse)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../../../../../../reference/tevm/procedures/type-aliases/ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](../../../../../../../reference/tevm/procedures/type-aliases/ethgetbalancejsonrpcresponse)

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Parameters

• **requests**: `ReadonlyArray`\<[`TevmJsonRpcRequest`](/reference/tevm/procedures/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/procedures/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/procedures/type-aliases/anviljsonrpcrequest/) \| [`DebugJsonRpcRequest`](/reference/tevm/procedures/type-aliases/debugjsonrpcrequest/)\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

## Source

[procedures/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts#L94)
