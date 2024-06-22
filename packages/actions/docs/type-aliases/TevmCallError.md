[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / TevmCallError

# Type alias: TevmCallError

> **TevmCallError**: [`ValidateCallParamsError`](ValidateCallParamsError.md) \| [`CallHandlerOptsError`](CallHandlerOptsError.md) \| `InternalError` \| `ExecutionError` \| `RevertError` \| [`ValidateCallParamsError`](ValidateCallParamsError.md) \| `HandleRunTxError` \| `ExecuteCallError` \| `InternalError`

All errors that can occur during a Tevm call
The type is strongly typed if using `throwOnFail: false`

## Examples

```typescript`
import {TevmCallError} from 'tevm/errors'
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

const result = await client.tevmCall({
  throwOnFail: false,
  to: '0x...',
  data: '0x...',
})

const errors = result.errors satisfies Array<TevmCallError> | undefined
```
If `throwOnFail: true` is used (the default), the errors are thrown directly. This type can then be used to catch the errors.

```typescript
import {TevmCallError} from 'tevm/errors'
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

try {
  await client.tevmCall({
  to: '0x...',
  data: '0x...',
  })
} catch (error) {
  const typedError = error as TevmCallError
  switch (typedErrorl.name) {
    case 'ValidateCallParamsError':
    case 'CallHandlerOptsError':
    case 'InternalError':
    case 'ExecutionError':
    case 'RevertError':
      handleIt()
    default:
      throw error
  }
}
```

## Source

[packages/actions/src/Call/TevmCallError.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/TevmCallError.ts#L53)
