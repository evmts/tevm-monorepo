[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilMetadataJsonRpcProcedure

# Function: anvilMetadataJsonRpcProcedure()

> **anvilMetadataJsonRpcProcedure**(`client`): [`AnvilMetadataProcedure`](../type-aliases/AnvilMetadataProcedure.md)

Defined in: [packages/actions/src/anvil/anvilMetadataProcedure.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilMetadataProcedure.js#L33)

Request handler for anvil_metadata JSON-RPC requests.
Returns metadata about the running Tevm node including version and fork information.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilMetadataProcedure`](../type-aliases/AnvilMetadataProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilMetadataJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
const procedure = anvilMetadataJsonRpcProcedure(node)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_metadata',
  params: [],
  id: 1
})
console.log(result.result)
// {
//   clientVersion: 'tevm/1.0.0',
//   chainId: 10,
//   forked: {
//     url: 'https://mainnet.optimism.io',
//     blockNumber: 12345
//   },
//   snapshots: {}
// }
```
