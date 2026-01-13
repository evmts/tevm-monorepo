[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawReceiptsJsonRpcProcedure

# Function: debugGetRawReceiptsJsonRpcProcedure()

> **debugGetRawReceiptsJsonRpcProcedure**(`client`): `DebugGetRawReceiptsProcedure`

Defined in: [packages/actions/src/debug/debugGetRawReceiptsProcedure.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawReceiptsProcedure.js#L25)

Request handler for debug_getRawReceipts JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugGetRawReceiptsProcedure`

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawReceiptsJsonRpcProcedure } from '@tevm/actions'

const client = createMemoryClient()
const procedure = debugGetRawReceiptsJsonRpcProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  id: 1,
  method: 'debug_getRawReceipts',
  params: ['latest']
})
console.log(response.result) // ['0x...', '0x...'] (array of hex-encoded RLP receipts)
```
