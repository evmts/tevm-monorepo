[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilNodeInfoJsonRpcProcedure

# Function: anvilNodeInfoJsonRpcProcedure()

> **anvilNodeInfoJsonRpcProcedure**(`client`): [`AnvilNodeInfoProcedure`](../type-aliases/AnvilNodeInfoProcedure.md)

Defined in: [packages/actions/src/anvil/anvilNodeInfoProcedure.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilNodeInfoProcedure.js#L32)

Request handler for anvil_nodeInfo JSON-RPC requests.
Returns configuration information about the running Tevm node.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilNodeInfoProcedure`](../type-aliases/AnvilNodeInfoProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilNodeInfoJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
const procedure = anvilNodeInfoJsonRpcProcedure(node)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_nodeInfo',
  params: [],
  id: 1
})
console.log(result.result)
// {
//   currentBlockNumber: 12345,
//   currentBlockTimestamp: 1234567890,
//   forkUrl: 'https://mainnet.optimism.io',
//   chainId: 10,
//   hardfork: 'cancun',
//   miningMode: 'auto'
// }
```
