[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetRpcUrlJsonRpcProcedure

# Function: anvilSetRpcUrlJsonRpcProcedure()

> **anvilSetRpcUrlJsonRpcProcedure**(`client`): [`AnvilSetRpcUrlProcedure`](../type-aliases/AnvilSetRpcUrlProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetRpcUrlProcedure.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetRpcUrlProcedure.js#L32)

Request handler for anvil_setRpcUrl JSON-RPC requests.
Sets a new RPC URL for forking mode. This method is primarily used to change
the backend RPC node without restarting the Tevm instance.

Note: This implementation has limitations as the TevmNode's forkTransport
is readonly. In a real Anvil implementation, this would require modifying
the underlying StateManager's forking configuration. For now, this method
is provided for API compatibility but may not fully change the fork behavior.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetRpcUrlProcedure`](../type-aliases/AnvilSetRpcUrlProcedure.md)

## Throws

if attempting to set a fork URL on a non-forked node

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetRpcUrlJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
const procedure = anvilSetRpcUrlJsonRpcProcedure(node)

// Change the fork URL
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setRpcUrl',
  params: ['https://mainnet.infura.io/v3/your-api-key'],
  id: 1
})
console.log(result.result) // null
```
