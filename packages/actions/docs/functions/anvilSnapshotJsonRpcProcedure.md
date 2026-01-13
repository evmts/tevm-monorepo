[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSnapshotJsonRpcProcedure

# Function: anvilSnapshotJsonRpcProcedure()

> **anvilSnapshotJsonRpcProcedure**(`client`): [`AnvilSnapshotProcedure`](../type-aliases/AnvilSnapshotProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSnapshotProcedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSnapshotProcedure.js#L23)

Request handler for anvil_snapshot JSON-RPC requests.
Snapshots the current state and returns a unique snapshot ID.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSnapshotProcedure`](../type-aliases/AnvilSnapshotProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { anvilSnapshotJsonRpcProcedure } from '@tevm/actions'

const client = createTevmNode()
const snapshotHandler = anvilSnapshotJsonRpcProcedure(client)

const response = await snapshotHandler({
  jsonrpc: '2.0',
  method: 'anvil_snapshot',
  id: 1,
  params: []
})
console.log(response.result) // '0x1'
```
