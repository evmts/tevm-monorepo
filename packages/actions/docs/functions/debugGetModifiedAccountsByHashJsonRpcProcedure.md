[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetModifiedAccountsByHashJsonRpcProcedure

# Function: debugGetModifiedAccountsByHashJsonRpcProcedure()

> **debugGetModifiedAccountsByHashJsonRpcProcedure**(`client`): `DebugGetModifiedAccountsByHashProcedure`

Defined in: [packages/actions/src/debug/debugGetModifiedAccountsByHashProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetModifiedAccountsByHashProcedure.js#L26)

Request handler for debug_getModifiedAccountsByHash JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetModifiedAccountsByHashProcedure`

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugGetModifiedAccountsByHashJsonRpcProcedure } from 'tevm/actions'

const client = createTevmNode()
const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)

const response = await procedure({
  id: 1,
  jsonrpc: '2.0',
  method: 'debug_getModifiedAccountsByHash',
  params: [{
    startBlockHash: '0xabc...',
    endBlockHash: '0xdef...'
  }]
})
```
