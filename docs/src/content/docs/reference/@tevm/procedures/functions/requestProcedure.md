---
editUrl: false
next: false
prev: false
title: "requestProcedure"
---

> **requestProcedure**(`client`): `TevmJsonRpcRequestHandler`

Request handler for JSON-RPC requests.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

Most users will want to use `Tevm.request` instead of
this method but this method may be desired if hyper optimizing
bundle size.

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

## Returns

`TevmJsonRpcRequestHandler`

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

## Source

[procedures/src/requestProcedure.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestProcedure.js#L68)
