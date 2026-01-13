[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawTransactionHandler

# Function: debugGetRawTransactionHandler()

> **debugGetRawTransactionHandler**(`client`): [`DebugGetRawTransactionHandler`](../type-aliases/DebugGetRawTransactionHandler.md)

Defined in: [packages/actions/src/debug/debugGetRawTransactionHandler.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawTransactionHandler.js#L20)

Returns the raw transaction bytes by transaction hash

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetRawTransactionHandler`](../type-aliases/DebugGetRawTransactionHandler.md)

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawTransactionHandler } from '@tevm/actions'

const client = createMemoryClient()
const handler = debugGetRawTransactionHandler(client)

const rawTx = await handler({ hash: '0x1234...' })
console.log(rawTx) // '0x...' (hex-encoded transaction)
```
