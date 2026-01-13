[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawReceiptsHandler

# Function: debugGetRawReceiptsHandler()

> **debugGetRawReceiptsHandler**(`client`): [`DebugGetRawReceiptsHandler`](../type-aliases/DebugGetRawReceiptsHandler.md)

Defined in: [packages/actions/src/debug/debugGetRawReceiptsHandler.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawReceiptsHandler.js#L21)

Returns the consensus-encoded (RLP) receipts from a block by block number or tag

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetRawReceiptsHandler`](../type-aliases/DebugGetRawReceiptsHandler.md)

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawReceiptsHandler } from '@tevm/actions'

const client = createMemoryClient()
const handler = debugGetRawReceiptsHandler(client)

const rawReceipts = await handler({ blockTag: 'latest' })
console.log(rawReceipts) // ['0x...', '0x...'] (array of hex-encoded RLP receipts)
```
