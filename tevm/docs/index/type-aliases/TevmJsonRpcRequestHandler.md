[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcRequestHandler

# Type Alias: TevmJsonRpcRequestHandler()

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`\[`"method"`\]\>\>

Defined in: packages/actions/dist/index.d.ts:4691

Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
and more feature-rich `actions` api

## Type Parameters

• **TRequest** *extends* [`TevmJsonRpcRequest`](TevmJsonRpcRequest.md) \| [`EthJsonRpcRequest`](../../actions/type-aliases/EthJsonRpcRequest.md) \| [`AnvilJsonRpcRequest`](../../actions/type-aliases/AnvilJsonRpcRequest.md) \| `DebugJsonRpcRequest`

## Parameters

### request

`TRequest`

## Returns

`Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`\[`"method"`\]\>\>

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

#### eth_createAccessList

Creates an access list for a transaction.
Returns list of addresses and storage keys that the transaction plans to access.

request - [EthCreateAccessListJsonRpcRequest](../../actions/type-aliases/EthCreateAccessListJsonRpcRequest.md)
response - [EthCreateAccessListJsonRpcResponse](../../actions/type-aliases/EthCreateAccessListJsonRpcResponse.md)

```typescript
const response = await tevm.request({
  method: 'eth_createAccessList',
  params: [{
    to: '0x...',
    data: '0x...'
  }],
  id: 1,
  jsonrpc: '2.0'
})
```
