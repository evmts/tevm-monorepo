[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugDumpBlockHandler

# Function: debugDumpBlockHandler()

> **debugDumpBlockHandler**(`client`): [`DebugDumpBlockHandler`](../type-aliases/DebugDumpBlockHandler.md)

Defined in: [packages/actions/src/debug/debugDumpBlockHandler.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugDumpBlockHandler.js#L21)

Returns the complete state at a specific block

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`DebugDumpBlockHandler`](../type-aliases/DebugDumpBlockHandler.md)

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { debugDumpBlockHandler } from 'tevm/actions'

const client = createTevmNode()

const dumpBlock = debugDumpBlockHandler(client)

const result = await dumpBlock({ blockTag: 'latest' })
console.log(result.root) // State root hash
console.log(result.accounts) // All accounts in the state
```
