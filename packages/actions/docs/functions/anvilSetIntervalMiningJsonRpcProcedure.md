[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetIntervalMiningJsonRpcProcedure

# Function: anvilSetIntervalMiningJsonRpcProcedure()

> **anvilSetIntervalMiningJsonRpcProcedure**(`client`): [`AnvilSetIntervalMiningProcedure`](../type-aliases/AnvilSetIntervalMiningProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetIntervalMiningProcedure.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetIntervalMiningProcedure.js#L32)

Request handler for anvil_setIntervalMining JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetIntervalMiningProcedure`](../type-aliases/AnvilSetIntervalMiningProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetIntervalMiningJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilSetIntervalMiningJsonRpcProcedure(node)

// Enable interval mining with 5 second block time
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setIntervalMining',
  params: [5],
  id: 1
})

console.log(result) // { jsonrpc: '2.0', method: 'anvil_setIntervalMining', result: null, id: 1 }

// Disable interval mining (blocks only mine via anvil_mine)
const disableResult = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setIntervalMining',
  params: [0],
  id: 2
})
```
