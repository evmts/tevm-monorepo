[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceBlockByHashJsonRpcProcedure

# Function: debugTraceBlockByHashJsonRpcProcedure()

> **debugTraceBlockByHashJsonRpcProcedure**(`client`): `DebugTraceBlockByHashProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceBlockByHashProcedure.js:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceBlockByHashProcedure.js#L49)

Creates a JSON-RPC procedure handler for the `debug_traceBlockByHash` method

This handler is a convenience wrapper around `debug_traceBlock` that accepts a block hash
as the first parameter directly (not wrapped in an object). It traces the execution of all
transactions in the specified block.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugTraceBlockByHashProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`, `boolean`\>

A handler function for debug_traceBlockByHash requests

## Throws

If the block cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugTraceBlockByHashJsonRpcProcedure } from '@tevm/actions'

// Create a node with automatic mining
const node = createTevmNode({ miningConfig: { type: 'auto' } })

// Get a block hash
const block = await node.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
const blockHash = '0x' + block.hash().toString('hex')

// Create the debug procedure handler
const debugProcedure = debugTraceBlockByHashJsonRpcProcedure(node)

// Trace the block by hash
const trace = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_traceBlockByHash',
  params: [
    blockHash,  // Block hash as hex string
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
