[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilRevertJsonRpcProcedure

# Function: anvilRevertJsonRpcProcedure()

> **anvilRevertJsonRpcProcedure**(`client`): [`AnvilRevertProcedure`](../type-aliases/AnvilRevertProcedure.md)

Defined in: [packages/actions/src/anvil/anvilRevertProcedure.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilRevertProcedure.js#L30)

Request handler for anvil_revert JSON-RPC requests.
Reverts the state to a previous snapshot.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilRevertProcedure`](../type-aliases/AnvilRevertProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { anvilRevertJsonRpcProcedure } from '@tevm/actions'

const client = createTevmNode()
const revertHandler = anvilRevertJsonRpcProcedure(client)

// First create a snapshot
const snapshotResponse = await client.request({
  method: 'anvil_snapshot'
})
const snapshotId = snapshotResponse.result

// Later revert to that snapshot
const response = await revertHandler({
  jsonrpc: '2.0',
  method: 'anvil_revert',
  id: 1,
  params: [snapshotId]
})
console.log(response.result) // true if successful, false if snapshot not found
```
