[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawBlockJsonRpcProcedure

# Function: debugGetRawBlockJsonRpcProcedure()

> **debugGetRawBlockJsonRpcProcedure**(`client`): `DebugGetRawBlockProcedure`

Defined in: [packages/actions/src/debug/debugGetRawBlockProcedure.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawBlockProcedure.js#L25)

Request handler for debug_getRawBlock JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetRawBlockProcedure`

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawBlockJsonRpcProcedure } from '@tevm/actions'

const client = createMemoryClient()
const procedure = debugGetRawBlockJsonRpcProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  id: 1,
  method: 'debug_getRawBlock',
  params: ['latest']
})
console.log(response.result) // '0x...' (hex-encoded RLP)
```
