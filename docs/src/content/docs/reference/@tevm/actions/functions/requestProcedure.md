---
editUrl: false
next: false
prev: false
title: "requestProcedure"
---

> **requestProcedure**(`client`): [`TevmJsonRpcRequestHandler`](/reference/tevm/actions/type-aliases/tevmjsonrpcrequesthandler/)

Request handler for JSON-RPC requests to Tevm.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`TevmJsonRpcRequestHandler`](/reference/tevm/actions/type-aliases/tevmjsonrpcrequesthandler/)

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

## See

createHandlers where handlers are defined

## Defined in

[packages/actions/src/requestProcedure.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/requestProcedure.js#L29)
