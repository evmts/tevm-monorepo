[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugDumpBlockJsonRpcProcedure

# Function: debugDumpBlockJsonRpcProcedure()

> **debugDumpBlockJsonRpcProcedure**(`client`): `DebugDumpBlockProcedure`

Defined in: [packages/actions/src/debug/debugDumpBlockProcedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugDumpBlockProcedure.js#L23)

Request handler for debug_dumpBlock JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugDumpBlockProcedure`

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugDumpBlockJsonRpcProcedure } from 'tevm/actions'

const client = createTevmNode()
const procedure = debugDumpBlockJsonRpcProcedure(client)

const response = await procedure({
  id: 1,
  jsonrpc: '2.0',
  method: 'debug_dumpBlock',
  params: [{ blockTag: 'latest' }]
})
```
