[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CommonMismatchError

# Class: CommonMismatchError

Represents an error that occurs when the Common for a given block does not match the Common of the VM.

Common mismatch errors can occur due to:
- Discrepancies between the Common configurations for a block and the VM.
- Attempting to use features from a different hardfork than what's configured.

## Example

```typescript
import { CommonMismatchError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { Hardfork } from '@tevm/common'

const client = createMemoryClient({ hardfork: Hardfork.Shanghai })

try {
  await client.setChain({ hardfork: Hardfork.London })
  // This might throw a CommonMismatchError if the operation is incompatible
} catch (error) {
  if (error instanceof CommonMismatchError) {
    console.error('Common mismatch:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the common mismatch error, possibly by updating the client configuration
  }
}
```

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new CommonMismatchError**(`message?`, `args?`): `CommonMismatchError`

Constructs a CommonMismatchError.

#### Parameters

##### message?

`string` = `'Common mismatch error occurred.'`

Human-readable error message.

##### args?

[`CommonMismatchErrorParameters`](../interfaces/CommonMismatchErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`CommonMismatchError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

***

### code

> `static` **code**: `number` = `-32015`

The error code for ExecutionError.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)
