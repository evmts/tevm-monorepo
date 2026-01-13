[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilMineDetailedJsonRpcProcedure

# Function: anvilMineDetailedJsonRpcProcedure()

> **anvilMineDetailedJsonRpcProcedure**(`client`): [`AnvilMineDetailedProcedure`](../type-aliases/AnvilMineDetailedProcedure.md)

Defined in: [packages/actions/src/anvil/anvilMineDetailedProcedure.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilMineDetailedProcedure.js#L27)

Request handler for anvil_mineDetailed JSON-RPC requests.
Mines blocks and returns detailed execution results including transaction traces.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilMineDetailedProcedure`](../type-aliases/AnvilMineDetailedProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilMineDetailedJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilMineDetailedJsonRpcProcedure(node)

// Mine a block with detailed results
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_mineDetailed',
  params: ['0x1', '0x1'],
  id: 1
})
console.log(result.result.blocks) // Detailed block information
```
