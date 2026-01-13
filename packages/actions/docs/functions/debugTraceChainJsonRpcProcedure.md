[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceChainJsonRpcProcedure

# Function: debugTraceChainJsonRpcProcedure()

> **debugTraceChainJsonRpcProcedure**(`client`): `DebugTraceChainProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceChainProcedure.js:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceChainProcedure.js#L53)

Creates a JSON-RPC procedure handler for the `debug_traceChain` method

This handler traces all transactions in a range of blocks, providing detailed
traces for each transaction. This can generate large amounts of data for
block ranges with many transactions, so use with caution.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugTraceChainProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

A handler function for debug_traceChain requests

## Throws

If any block in the range cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugTraceChainJsonRpcProcedure } from '@tevm/actions'

// Create a node with automatic mining
const node = createTevmNode({ miningConfig: { type: 'auto' } })

// Get the current block number
const currentBlock = await node.getBlockNumber()

// Create the debug procedure handler
const debugProcedure = debugTraceChainJsonRpcProcedure(node)

// Trace all transactions between two blocks
const response = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_traceChain',
  params: [
    currentBlock - 5n, // Start block
    currentBlock,      // End block
    {
      tracer: 'callTracer',
      tracerConfig: {}
    }
  ],
  id: 1
})

console.log('Chain traces:', response.result)
// Output: Array of block results, each containing traces for all transactions
```
