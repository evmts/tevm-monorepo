---
editUrl: false
next: false
prev: false
title: "validateLoadStateParams"
---

> **validateLoadStateParams**(`action`): [`InvalidRequestError`](/reference/tevm/errors/classes/invalidrequesterror/)[]

Validates the parameters for loading the state into the VM.

## Parameters

• **action**: [`LoadStateParams`](/reference/tevm/actions/type-aliases/loadstateparams/)\<`boolean`\>

The parameters for the load state action.

## Returns

[`InvalidRequestError`](/reference/tevm/errors/classes/invalidrequesterror/)[]

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

## Defined in

[packages/actions/src/LoadState/validateLoadStateParams.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/validateLoadStateParams.js#L26)
