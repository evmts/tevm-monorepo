[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetRawBlockHandler

# Function: debugGetRawBlockHandler()

> **debugGetRawBlockHandler**(`client`): [`DebugGetRawBlockHandler`](../type-aliases/DebugGetRawBlockHandler.md)

Defined in: [packages/actions/src/debug/debugGetRawBlockHandler.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetRawBlockHandler.js#L20)

Returns the RLP-encoded block by block number or tag

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetRawBlockHandler`](../type-aliases/DebugGetRawBlockHandler.md)

## Example

```javascript
import { createMemoryClient } from '@tevm/memory-client'
import { debugGetRawBlockHandler } from '@tevm/actions'

const client = createMemoryClient()
const handler = debugGetRawBlockHandler(client)

const rawBlock = await handler({ blockTag: 'latest' })
console.log(rawBlock) // '0x...' (hex-encoded RLP)
```
