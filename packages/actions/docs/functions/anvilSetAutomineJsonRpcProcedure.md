[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetAutomineJsonRpcProcedure

# Function: anvilSetAutomineJsonRpcProcedure()

> **anvilSetAutomineJsonRpcProcedure**(`client`): [`AnvilSetAutomineProcedure`](../type-aliases/AnvilSetAutomineProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetAutomineProcedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetAutomineProcedure.js#L23)

Request handler for anvil_setAutomine JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetAutomineProcedure`](../type-aliases/AnvilSetAutomineProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetAutomineJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilSetAutomineJsonRpcProcedure(node)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setAutomine',
  params: [true],
  id: 1
})

console.log(result) // { jsonrpc: '2.0', method: 'anvil_setAutomine', result: null, id: 1 }
```
