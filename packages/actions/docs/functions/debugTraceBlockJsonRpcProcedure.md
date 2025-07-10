[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockJsonRpcProcedure

# Function: debugTraceBlockJsonRpcProcedure()

> **debugTraceBlockJsonRpcProcedure**(`client`): `DebugTraceBlockProcedure`\<`"callTracer"` \| `"prestateTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceBlockProcedure.js:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceBlockProcedure.js#L53)

Creates a JSON-RPC procedure handler for the `debug_traceBlock` method

This handler traces the execution of all transactions in a block, providing
detailed traces for each transaction. It handles both block hash and block number
identifiers and supports multiple tracer types.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugTraceBlockProcedure`\<`"callTracer"` \| `"prestateTracer"`, `boolean`\>

A handler function for debug_traceBlock requests

## Throws

If the block cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugTraceBlockJsonRpcProcedure } from '@tevm/actions'

// Create a node with automatic mining
const node = createTevmNode({ miningConfig: { type: 'auto' } })

// Get a block
const blockNumber = await node.getBlockNumber()

// Create the debug procedure handler
const debugProcedure = debugTraceBlockJsonRpcProcedure(node)

// Trace the block
const trace = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_traceBlock',
  params: [
    blockNumber,  // Or block hash as a hex string
    {
      tracer: 'callTracer',  // Or 'prestateTracer'
      tracerConfig: {
        // diffMode: true  // Only for prestateTracer
      }
    }
  ],
  id: 1
})

console.log('Block transaction traces:', trace.result)
```
