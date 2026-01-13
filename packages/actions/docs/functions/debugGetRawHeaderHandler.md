[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawHeaderHandler

# Function: debugGetRawHeaderHandler()

> **debugGetRawHeaderHandler**(`client`): [`DebugGetRawHeaderHandler`](../type-aliases/DebugGetRawHeaderHandler.md)

Defined in: [packages/actions/src/debug/debugGetRawHeaderHandler.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawHeaderHandler.js#L20)

Returns the RLP-encoded block header by block number or tag

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetRawHeaderHandler`](../type-aliases/DebugGetRawHeaderHandler.md)

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawHeaderHandler } from '@tevm/actions'

const client = createMemoryClient()
const handler = debugGetRawHeaderHandler(client)

const rawHeader = await handler({ blockTag: 'latest' })
console.log(rawHeader) // '0x...' (hex-encoded RLP)
```
