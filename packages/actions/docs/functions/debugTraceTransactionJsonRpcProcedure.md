[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceTransactionJsonRpcProcedure

# Function: debugTraceTransactionJsonRpcProcedure()

> **debugTraceTransactionJsonRpcProcedure**(`client`): `DebugTraceTransactionProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"`, `boolean`\>

Defined in: [packages/actions/src/debug/debugTraceTransactionProcedure.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceTransactionProcedure.js#L61)

Creates a JSON-RPC procedure handler for the `debug_traceTransaction` method

This handler traces the execution of a historical transaction using the EVM's step-by-step
execution tracing capabilities. It reconstructs the state at the point of the transaction
by replaying all previous transactions in the block and then provides a detailed trace.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugTraceTransactionProcedure`\<`"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"`, `boolean`\>

A handler function for debug_traceTransaction requests

## Throws

If the transaction cannot be found

## Throws

If the parent block's state root is not available and cannot be forked

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { createAddress } from '@tevm/address'
import { debugTraceTransactionJsonRpcProcedure } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'

// Create a node and deploy a contract
const node = createTevmNode({ miningConfig: { type: 'auto' } })
const contract = SimpleContract.withAddress(createAddress('0x1234').toString())

// Deploy contract
const deployResult = await node.tevmDeploy(contract.deploy(1n))

// Call a contract method that will create a transaction
const callResult = await node.tevmCall({
  createTransaction: true,
  ...contract.write.set(42n)
})

// Get the transaction hash from the call result
const txHash = callResult.txHash

// Create the debug procedure handler
const debugProcedure = debugTraceTransactionJsonRpcProcedure(node)

// Trace the transaction
const trace = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_traceTransaction',
  params: [{
    transactionHash: txHash,
    tracer: 'callTracer' // Or other tracer options
  }],
  id: 1
})

console.log('Transaction trace:', trace.result)
```
