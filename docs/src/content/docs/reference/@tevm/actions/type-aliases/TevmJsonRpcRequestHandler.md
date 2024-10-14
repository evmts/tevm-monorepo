---
editUrl: false
next: false
prev: false
title: "TevmJsonRpcRequestHandler"
---

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/actions/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

## Type Parameters

• **TRequest** *extends* [`TevmJsonRpcRequest`](/reference/tevm/actions/type-aliases/tevmjsonrpcrequest/) \| [`EthJsonRpcRequest`](/reference/tevm/actions/type-aliases/ethjsonrpcrequest/) \| [`AnvilJsonRpcRequest`](/reference/tevm/actions/type-aliases/anviljsonrpcrequest/) \| `DebugJsonRpcRequest`

## Parameters

• **request**: `TRequest`

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](/reference/tevm/actions/type-aliases/jsonrpcreturntypefrommethod/)\<`TRequest`\[`"method"`\]\>\>

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

request - [CallJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/calljsonrpcrequest)
response - [CallJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/calljsonrpcresponse)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/getaccountjsonrpcrequest)
response - [GetAccountJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/getaccountjsonrpcresponse)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/setaccountjsonrpcrequest)
response - SetAccountJsonRpcResponse

### debug_* methods

#### debug_traceCall

request - DebugTraceCallJsonRpcRequest
response - DebugTraceCallJsonRpcResponse

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethblocknumberjsonrpcrequest)
response - [EthBlockNumberJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethblocknumberjsonrpcresponse)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethchainidjsonrpcrequest)
response - [EthChainIdJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethchainidjsonrpcresponse)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethgetcodejsonrpcrequest)
response - [EthGetCodeJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethgetcodejsonrpcresponse)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethgetstorageatjsonrpcrequest)
response - [EthGetStorageAtJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethgetstorageatjsonrpcresponse)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethgaspricejsonrpcrequest)
response - [EthGasPriceJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethgaspricejsonrpcresponse)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../../../../../../../reference/tevm/actions/type-aliases/ethgetbalancejsonrpcrequest)
response - [EthGetBalanceJsonRpcResponse](../../../../../../../../reference/tevm/actions/type-aliases/ethgetbalancejsonrpcresponse)

## Defined in

[packages/actions/src/tevm-request-handler/TevmJsonRpcRequestHandler.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/TevmJsonRpcRequestHandler.ts#L82)
