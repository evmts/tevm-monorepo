---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcBulkRequestHandler"
---

`Experimental`

> **TevmJsonRpcBulkRequestHandler**: (`requests`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures-types/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

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

request - [CallJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/calljsonrpcrequest)
response - [CallJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/calljsonrpcresponse)

#### tevm_script

request - [ScriptJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/scriptjsonrpcrequest)
response - [ScriptJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/scriptjsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/setaccountjsonrpcrequest)
response - [SetAccountJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/setaccountjsonrpcresponse)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/debugtracecalljsonrpcrequest)
response - [DebugTraceCallJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/debugtracecalljsonrpcresponse)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](../../../../../../../reference/tevm/procedures-types/type-aliases/ethgetbalancejsonrpcresponse)

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Parameters

• **requests**: `ReadonlyArray`\<[`TevmJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/anviljsonrpcrequest/) \| [`DebugJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/debugjsonrpcrequest/)\>

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures-types/type-aliases/jsonrpcreturntypefrommethod/)\<`any`\>[]\>

## Source

[tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/TevmJsonRpcBulkRequestHandler.ts#L117)
