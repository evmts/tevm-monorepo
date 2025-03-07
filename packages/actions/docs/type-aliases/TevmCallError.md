[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TevmCallError

# Type Alias: TevmCallError

> **TevmCallError**: [`ValidateCallParamsError`](ValidateCallParamsError.md) \| [`CallHandlerOptsError`](CallHandlerOptsError.md) \| `InternalError` \| `ExecutionError` \| `RevertError` \| [`ExecuteCallError`](ExecuteCallError.md) \| [`ExecuteCallError`](ExecuteCallError.md)

Defined in: [packages/actions/src/Call/TevmCallError.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/TevmCallError.ts#L62)

All errors that can occur during a TEVM call.
This type is strongly typed if using `throwOnFail: false`.

## Examples

```typescript
import { TevmCallError } from 'tevm/errors'
import { createMemoryClient, tevmCall } from 'tevm'

const client = createMemoryClient()

const result = await tevmCall(client, {
  throwOnFail: false,
  to: '0x...',
  data: '0x...',
})

const errors = result.errors satisfies Array<TevmCallError> | undefined
if (errors) {
  errors.forEach((error) => console.error(error))
}
```

If `throwOnFail: true` is used (the default), the errors are thrown directly. This type can then be used to catch the errors.

```typescript
import { TevmCallError } from 'tevm/errors'
import { createMemoryClient, tevmCall } from 'tevm'

const client = createMemoryClient()

try {
  await tevmCall(client, {
    to: '0x...',
    data: '0x...',
  })
} catch (error) {
  const typedError = error as TevmCallError
  switch (typedError.name) {
    case 'ValidateCallParamsError':
    case 'CallHandlerOptsError':
    case 'InternalError':
    case 'ExecutionError':
    case 'RevertError':
    case 'HandleRunTxError':
    case 'ExecuteCallError':
      handleIt(typedError)
      break
    default:
      throw error
  }
}
```
