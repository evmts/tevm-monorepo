---
editUrl: false
next: false
prev: false
title: "requestProcedure"
---

> **requestProcedure**(`client`): [`TevmJsonRpcRequestHandler`](/reference/tevm/procedures/type-aliases/tevmjsonrpcrequesthandler/)

Request handler for JSON-RPC requests.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

Most users will want to use `Tevm.request` instead of
this method but this method may be desired if hyper optimizing
bundle size.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`TevmJsonRpcRequestHandler`](/reference/tevm/procedures/type-aliases/tevmjsonrpcrequesthandler/)

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

## Defined in

[procedures/src/requestProcedure.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestProcedure.js#L32)
