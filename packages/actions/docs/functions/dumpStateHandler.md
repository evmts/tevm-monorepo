[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / dumpStateHandler

# Function: dumpStateHandler()

> **dumpStateHandler**(`client`, `options`?): [`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

Creates a handler for dumping the TEVM state.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM client instance.

• **options?** = `{}`

Optional settings.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error if the state dump fails.

## Returns

[`DumpStateHandler`](../type-aliases/DumpStateHandler.md)

- The state dump handler function.

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

## Defined in

[packages/actions/src/DumpState/dumpStateHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/dumpStateHandler.js#L32)
