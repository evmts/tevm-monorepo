[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetModifiedAccountsByNumberJsonRpcProcedure

# Function: debugGetModifiedAccountsByNumberJsonRpcProcedure()

> **debugGetModifiedAccountsByNumberJsonRpcProcedure**(`client`): `DebugGetModifiedAccountsByNumberProcedure`

Defined in: [packages/actions/src/debug/debugGetModifiedAccountsByNumberProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetModifiedAccountsByNumberProcedure.js#L26)

Request handler for debug_getModifiedAccountsByNumber JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetModifiedAccountsByNumberProcedure`

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugGetModifiedAccountsByNumberJsonRpcProcedure } from 'tevm/actions'

const client = createTevmNode()
const procedure = debugGetModifiedAccountsByNumberJsonRpcProcedure(client)

const response = await procedure({
  id: 1,
  jsonrpc: '2.0',
  method: 'debug_getModifiedAccountsByNumber',
  params: [{
    startBlockNumber: '0x64',
    endBlockNumber: '0x65'
  }]
})
```
