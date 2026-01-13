[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugGetModifiedAccountsByNumberHandler

# Function: debugGetModifiedAccountsByNumberHandler()

> **debugGetModifiedAccountsByNumberHandler**(`client`): [`DebugGetModifiedAccountsByNumberHandler`](../type-aliases/DebugGetModifiedAccountsByNumberHandler.md)

Defined in: [packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js#L23)

Returns addresses of accounts modified between two block numbers

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugGetModifiedAccountsByNumberHandler`](../type-aliases/DebugGetModifiedAccountsByNumberHandler.md)

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugGetModifiedAccountsByNumberHandler } from 'tevm/actions'

const client = createTevmNode()

const getModifiedAccounts = debugGetModifiedAccountsByNumberHandler(client)

const result = await getModifiedAccounts({
  startBlockNumber: 100n,
  endBlockNumber: 101n
})
console.log(result) // Array of modified account addresses
```
