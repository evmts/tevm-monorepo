[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockByNumberJsonRpcProcedure

# Function: debugTraceBlockByNumberJsonRpcProcedure()

> **debugTraceBlockByNumberJsonRpcProcedure**(`client`): `DebugTraceBlockByNumberProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceBlockByNumberProcedure.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceBlockByNumberProcedure.js#L48)

Creates a JSON-RPC procedure handler for the `debug_traceBlockByNumber` method

This handler is a convenience wrapper around `debug_traceBlock` that accepts a block number
as the first parameter directly (not wrapped in an object). It traces the execution of all
transactions in the specified block.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugTraceBlockByNumberProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

A handler function for debug_traceBlockByNumber requests

## Throws

If the block cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugTraceBlockByNumberJsonRpcProcedure } from '@tevm/actions'

// Create a node with automatic mining
const node = createTevmNode({ miningConfig: { type: 'auto' } })

// Get a block number
const blockNumber = await node.getBlockNumber()

// Create the debug procedure handler
const debugProcedure = debugTraceBlockByNumberJsonRpcProcedure(node)

// Trace the block by number
const trace = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_traceBlockByNumber',
  params: [
    '0x1',  // Block number as hex string, or 'latest', 'earliest', 'pending'
    {
      tracer: 'callTracer',  // Or 'prestateTracer'
      tracerConfig: {
        // Configuration options for the tracer
      }
    }
  ],
  id: 1
})

console.log('Block transaction traces:', trace.result)
```
