[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugPreimageJsonRpcProcedure

# Function: debugPreimageJsonRpcProcedure()

> **debugPreimageJsonRpcProcedure**(`client`): `DebugPreimageProcedure`

Defined in: [packages/actions/src/debug/debugPreimageProcedure.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugPreimageProcedure.js#L46)

Creates a JSON-RPC procedure handler for the `debug_preimage` method

This handler returns the preimage (original data) for a given SHA3 hash if it
has been tracked/stored by the node. Preimages are typically tracked for
storage keys and account data to enable debugging and state inspection.

Note: In the current implementation, preimage tracking is limited. The node
only tracks preimages that it has explicitly cached. For most use cases,
this will return null as full preimage tracking has significant performance
and storage overhead.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM node instance

## Returns

`DebugPreimageProcedure`

A handler function for debug_preimage requests

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { debugPreimageJsonRpcProcedure } from '@tevm/actions'
import { keccak256 } from '@tevm/utils'

// Create a node
const node = createTevmNode()

// Get the hash of some data
const data = '0x1234567890abcdef'
const hash = keccak256(data)

// Create the debug procedure handler
const debugProcedure = debugPreimageJsonRpcProcedure(node)

// Try to get the preimage for the hash
const response = await debugProcedure({
  jsonrpc: '2.0',
  method: 'debug_preimage',
  params: [hash],
  id: 1
})

console.log('Preimage:', response.result)
// Output: '0x1234567890abcdef' if tracked, or null if not available
```
