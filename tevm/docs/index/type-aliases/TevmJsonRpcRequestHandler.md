[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcRequestHandler

# Type alias: TevmJsonRpcRequestHandler()

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`\[`"method"`\]\>\>

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

request - [CallJsonRpcRequest](../../procedures/type-aliases/CallJsonRpcRequest.md)
response - [CallJsonRpcResponse](../../procedures/type-aliases/CallJsonRpcResponse.md)

#### tevm_script

request - [ScriptJsonRpcRequest](../../procedures/type-aliases/ScriptJsonRpcRequest.md)
response - [ScriptJsonRpcResponse](../../procedures/type-aliases/ScriptJsonRpcResponse.md)

#### tevm_getAccount

request - [GetAccountJsonRpcRequest](../../procedures/type-aliases/GetAccountJsonRpcRequest.md)
response - [GetAccountJsonRpcResponse](../../procedures/type-aliases/GetAccountJsonRpcResponse.md)

#### tevm_setAccount

request - [SetAccountJsonRpcRequest](../../procedures/type-aliases/SetAccountJsonRpcRequest.md)
response - [SetAccountJsonRpcResponse](../../procedures/type-aliases/SetAccountJsonRpcResponse.md)

### debug_* methods

#### debug_traceCall

request - [DebugTraceCallJsonRpcRequest](../../procedures/type-aliases/DebugTraceCallJsonRpcRequest.md)
response - [DebugTraceCallJsonRpcResponse](../../procedures/type-aliases/DebugTraceCallJsonRpcResponse.md)

### eth_* methods

#### eth_blockNumber

request - [EthBlockNumberJsonRpcRequest](../../procedures/type-aliases/EthBlockNumberJsonRpcRequest.md)
response - [EthBlockNumberJsonRpcResponse](../../procedures/type-aliases/EthBlockNumberJsonRpcResponse.md)

#### eth_chainId

request - [EthChainIdJsonRpcRequest](../../procedures/type-aliases/EthChainIdJsonRpcRequest.md)
response - [EthChainIdJsonRpcResponse](../../procedures/type-aliases/EthChainIdJsonRpcResponse.md)

#### eth_getCode

request - [EthGetCodeJsonRpcRequest](../../procedures/type-aliases/EthGetCodeJsonRpcRequest.md)
response - [EthGetCodeJsonRpcResponse](../../procedures/type-aliases/EthGetCodeJsonRpcResponse.md)

#### eth_getStorageAt

request - [EthGetStorageAtJsonRpcRequest](../../procedures/type-aliases/EthGetStorageAtJsonRpcRequest.md)
response - [EthGetStorageAtJsonRpcResponse](../../procedures/type-aliases/EthGetStorageAtJsonRpcResponse.md)

#### eth_gasPrice

request - [EthGasPriceJsonRpcRequest](../../procedures/type-aliases/EthGasPriceJsonRpcRequest.md)
response - [EthGasPriceJsonRpcResponse](../../procedures/type-aliases/EthGasPriceJsonRpcResponse.md)

#### eth_getBalance

request - [EthGetBalanceJsonRpcRequest](../../procedures/type-aliases/EthGetBalanceJsonRpcRequest.md)
response - [EthGetBalanceJsonRpcResponse](../../procedures/type-aliases/EthGetBalanceJsonRpcResponse.md)

## Type parameters

• **TRequest** *extends* [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../procedures/type-aliases/EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](../../procedures/type-aliases/AnvilJsonRpcRequest.md) \| [`DebugJsonRpcRequest`](../../procedures/type-aliases/DebugJsonRpcRequest.md)

## Parameters

• **request**: `TRequest`

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`\[`"method"`\]\>\>

## Source

packages/procedures/dist/index.d.ts:1184
