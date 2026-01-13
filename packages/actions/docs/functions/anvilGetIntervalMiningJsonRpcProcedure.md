[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilGetIntervalMiningJsonRpcProcedure

# Function: anvilGetIntervalMiningJsonRpcProcedure()

> **anvilGetIntervalMiningJsonRpcProcedure**(`client`): [`AnvilGetIntervalMiningProcedure`](../type-aliases/AnvilGetIntervalMiningProcedure.md)

Defined in: [packages/actions/src/anvil/anvilGetIntervalMiningProcedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilGetIntervalMiningProcedure.js#L23)

Request handler for anvil_getIntervalMining JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilGetIntervalMiningProcedure`](../type-aliases/AnvilGetIntervalMiningProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilGetIntervalMiningJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode({ miningConfig: { type: 'interval', blockTime: 5 } })
const procedure = anvilGetIntervalMiningJsonRpcProcedure(node)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_getIntervalMining',
  params: [],
  id: 1
})

console.log(result) // { jsonrpc: '2.0', method: 'anvil_getIntervalMining', result: 5, id: 1 }
```
