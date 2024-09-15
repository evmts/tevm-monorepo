---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcRequestHandler"
---

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

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

request - [CallJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/calljsonrpcrequest)
response - [CallJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/calljsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/setaccountjsonrpcrequest)
response - [SetAccountJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/setaccountjsonrpcresponse)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/debugtracecalljsonrpcrequest)
response - [DebugTraceCallJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/debugtracecalljsonrpcresponse)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](../../../../../../../../reference/tevm/procedures/type-aliases/ethgetbalancejsonrpcresponse)

## Type Parameters

• **TRequest** *extends* [`TevmJsonRpcRequest`](/reference/tevm/procedures/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/procedures/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/procedures/type-aliases/anviljsonrpcrequest/) \| [`DebugJsonRpcRequest`](/reference/tevm/procedures/type-aliases/debugjsonrpcrequest/)

## Parameters

• **request**: `TRequest`

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/procedures/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

## Defined in

[packages/procedures/src/tevm-request-handler/TevmJsonRpcRequestHandler.ts:90](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/TevmJsonRpcRequestHandler.ts#L90)
