[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugStorageRangeAtJsonRpcProcedure

# Function: debugStorageRangeAtJsonRpcProcedure()

> **debugStorageRangeAtJsonRpcProcedure**(`client`): `DebugStorageRangeAtProcedure`

Defined in: [packages/actions/src/debug/debugStorageRangeAtProcedure.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugStorageRangeAtProcedure.js#L29)

Request handler for debug_storageRangeAt JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugStorageRangeAtProcedure`

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugStorageRangeAtJsonRpcProcedure } from 'tevm/actions'

const client = createTevmNode()
const procedure = debugStorageRangeAtJsonRpcProcedure(client)

const response = await procedure({
  id: 1,
  jsonrpc: '2.0',
  method: 'debug_storageRangeAt',
  params: [{
    blockTag: 'latest',
    txIndex: 0,
    address: '0x1234...',
    startKey: '0x0',
    maxResult: 100
  }]
})
```
