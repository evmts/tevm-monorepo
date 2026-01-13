[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetModifiedAccountsByHashHandler

# Function: debugGetModifiedAccountsByHashHandler()

> **debugGetModifiedAccountsByHashHandler**(`client`): [`DebugGetModifiedAccountsByHashHandler`](../type-aliases/DebugGetModifiedAccountsByHashHandler.md)

Defined in: [packages/actions/src/debug/debugGetModifiedAccountsByHashHandler.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetModifiedAccountsByHashHandler.js#L23)

Returns addresses of accounts modified between two block hashes

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetModifiedAccountsByHashHandler`](../type-aliases/DebugGetModifiedAccountsByHashHandler.md)

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugGetModifiedAccountsByHashHandler } from 'tevm/actions'

const client = createTevmNode()

const getModifiedAccounts = debugGetModifiedAccountsByHashHandler(client)

const result = await getModifiedAccounts({
  startBlockHash: '0xabc...',
  endBlockHash: '0xdef...'
})
console.log(result) // Array of modified account addresses
```
