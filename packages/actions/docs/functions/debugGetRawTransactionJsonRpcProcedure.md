[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawTransactionJsonRpcProcedure

# Function: debugGetRawTransactionJsonRpcProcedure()

> **debugGetRawTransactionJsonRpcProcedure**(`client`): `DebugGetRawTransactionProcedure`

Defined in: [packages/actions/src/debug/debugGetRawTransactionProcedure.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawTransactionProcedure.js#L24)

Request handler for debug_getRawTransaction JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetRawTransactionProcedure`

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawTransactionJsonRpcProcedure } from '@tevm/actions'

const client = createMemoryClient()
const procedure = debugGetRawTransactionJsonRpcProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  id: 1,
  method: 'debug_getRawTransaction',
  params: ['0x1234...']
})
console.log(response.result) // '0x...' (hex-encoded transaction)
```
