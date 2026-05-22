[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / dumpStateHandler

# Function: dumpStateHandler()

> **dumpStateHandler**(`client`, `options?`): [`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

Defined in: [packages/actions/src/DumpState/dumpStateHandler.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/dumpStateHandler.js#L62)

Creates a handler for dumping the TEVM state.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `options?` | \{ `throwOnFail?`: `boolean`; \} | - |
| `options.throwOnFail?` | `boolean` | - |

## Returns

[`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { dumpStateHandler } from 'tevm/actions'

const client = createTevmNode()

const dumpState = dumpStateHandler(client)

const { state, errors } = await dumpState()
if (errors) {
  console.error(errors)
} else {
  console.log(state)
}
```
