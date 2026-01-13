[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetLoggingEnabledJsonRpcProcedure

# Function: anvilSetLoggingEnabledJsonRpcProcedure()

> **anvilSetLoggingEnabledJsonRpcProcedure**(`client`): [`AnvilSetLoggingEnabledProcedure`](../type-aliases/AnvilSetLoggingEnabledProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetLoggingEnabledProcedure.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetLoggingEnabledProcedure.js#L25)

Request handler for anvil_setLoggingEnabled JSON-RPC requests.
Enables or disables logging output from the Tevm node.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetLoggingEnabledProcedure`](../type-aliases/AnvilSetLoggingEnabledProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetLoggingEnabledJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilSetLoggingEnabledJsonRpcProcedure(node)

// Disable logging
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setLoggingEnabled',
  params: [false],
  id: 1
})
console.log(result.result) // null
```
