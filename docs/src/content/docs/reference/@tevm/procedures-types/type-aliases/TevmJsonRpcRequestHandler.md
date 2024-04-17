---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcRequestHandler"
---

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures-types/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

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

## Type parameters

• **TRequest** extends [`TevmJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/anviljsonrpcrequest/) \| [`DebugJsonRpcRequest`](/reference/tevm/procedures-types/type-aliases/debugjsonrpcrequest/)

## Parameters

• **request**: `TRequest`

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures-types/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

## Source

[tevm-request-handler/TevmJsonRpcRequestHandler.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/TevmJsonRpcRequestHandler.ts#L113)
