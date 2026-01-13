[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilEnableTracesJsonRpcProcedure

# Function: anvilEnableTracesJsonRpcProcedure()

> **anvilEnableTracesJsonRpcProcedure**(`client`): [`AnvilEnableTracesProcedure`](../type-aliases/AnvilEnableTracesProcedure.md)

Defined in: [packages/actions/src/anvil/anvilEnableTracesProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilEnableTracesProcedure.js#L26)

Request handler for anvil_enableTraces JSON-RPC requests.
Enables or disables automatic trace collection for all transactions.
When enabled, all executed transactions include traces in their responses.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilEnableTracesProcedure`](../type-aliases/AnvilEnableTracesProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilEnableTracesJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilEnableTracesJsonRpcProcedure(node)

// Enable automatic tracing
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_enableTraces',
  params: [true],
  id: 1
})
console.log(result.result) // null
```
