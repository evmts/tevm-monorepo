[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugStorageRangeAtHandler

# Function: debugStorageRangeAtHandler()

> **debugStorageRangeAtHandler**(`client`): [`DebugStorageRangeAtHandler`](../type-aliases/DebugStorageRangeAtHandler.md)

Defined in: [packages/actions/src/debug/debugStorageRangeAtHandler.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugStorageRangeAtHandler.js#L28)

Returns a range of storage slots for an account at a specific block

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugStorageRangeAtHandler`](../type-aliases/DebugStorageRangeAtHandler.md)

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugStorageRangeAtHandler } from 'tevm/actions'

const client = createTevmNode()

const storageRange = debugStorageRangeAtHandler(client)

const result = await storageRange({
  blockTag: 'latest',
  txIndex: 0,
  address: '0x1234...',
  startKey: '0x0',
  maxResult: 100
})
console.log(result.storage) // Storage entries
console.log(result.nextKey) // Next key for pagination
```
