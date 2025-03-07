[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / validateLoadStateParams

# Function: validateLoadStateParams()

> **validateLoadStateParams**(`action`): `InvalidRequestError`[]

Defined in: [packages/actions/src/LoadState/validateLoadStateParams.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/validateLoadStateParams.js#L26)

Validates the parameters for loading the state into the VM.

## Parameters

### action

[`LoadStateParams`](../type-aliases/LoadStateParams.md)\<`boolean`\>

The parameters for the load state action.

## Returns

`InvalidRequestError`[]

- An array of errors, if any.

## Example

```typescript
import { validateLoadStateParams } from 'tevm/actions'

const params = { state: {...}  }
const errors = validateLoadStateParams(params)
if (errors.length > 0) {
  console.error('Validation errors:', errors)
}
```
