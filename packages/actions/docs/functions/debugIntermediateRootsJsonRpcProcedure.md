[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugIntermediateRootsJsonRpcProcedure

# Function: debugIntermediateRootsJsonRpcProcedure()

> **debugIntermediateRootsJsonRpcProcedure**(`client`): `DebugIntermediateRootsProcedure`

Defined in: [packages/actions/src/debug/debugIntermediateRootsProcedure.js:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugIntermediateRootsProcedure.js#L44)

Creates a JSON-RPC procedure handler for the `debug_intermediateRoots` method

This handler executes a block and returns the state root after each transaction
has been executed. This is useful for understanding how state changes incrementally
as each transaction in a block is processed.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugIntermediateRootsProcedure`

A handler function for debug_intermediateRoots requests

## Throws

If the block cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugIntermediateRootsJsonRpcProcedure } from '@tevm/actions'

// Create a node with automatic mining
const node = createTevmNode({ miningConfig: { type: 'auto' } })

// Get the latest block number
const blockNumber = await node.getBlockNumber()

// Create the debug procedure handler
const debugProcedure = debugIntermediateRootsJsonRpcProcedure(node)

// Get intermediate roots for the block
const response = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_intermediateRoots',
  params: [blockNumber],
  id: 1
})

console.log('Intermediate state roots:', response.result)
// Output: ['0x...', '0x...', ...] - one root per transaction
```
