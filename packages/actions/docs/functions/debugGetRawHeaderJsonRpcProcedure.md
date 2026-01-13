[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawHeaderJsonRpcProcedure

# Function: debugGetRawHeaderJsonRpcProcedure()

> **debugGetRawHeaderJsonRpcProcedure**(`client`): `DebugGetRawHeaderProcedure`

Defined in: [packages/actions/src/debug/debugGetRawHeaderProcedure.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawHeaderProcedure.js#L25)

Request handler for debug_getRawHeader JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetRawHeaderProcedure`

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawHeaderJsonRpcProcedure } from '@tevm/actions'

const client = createMemoryClient()
const procedure = debugGetRawHeaderJsonRpcProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  id: 1,
  method: 'debug_getRawHeader',
  params: ['latest']
})
console.log(response.result) // '0x...' (hex-encoded RLP)
```
