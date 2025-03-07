[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmJsonRpcRequestHandler

# Type Alias: TevmJsonRpcRequestHandler()

> **TevmJsonRpcRequestHandler**: \<`TRequest`\>(`request`) => `Promise`\<[`JsonRpcReturnTypeFromMethod`](JsonRpcReturnTypeFromMethod.md)\<`TRequest`\[`"method"`\]\>\>

Defined in: packages/actions/types/tevm-request-handler/TevmJsonRpcRequestHandler.d.ts:101

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

#### eth_createAccessList

Creates an access list for a transaction.
Returns list of addresses and storage keys that the transaction plans to access.

request - EthCreateAccessListJsonRpcRequest
response - EthCreateAccessListJsonRpcResponse

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
