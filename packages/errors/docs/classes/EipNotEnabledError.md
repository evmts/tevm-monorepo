[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / EipNotEnabledError

# Class: EipNotEnabledError

Represents an error that occurs when an EIP (Ethereum Improvement Proposal) is not enabled.

EIP not enabled errors can occur due to:
- Attempting to use features or operations that require a specific EIP which is not enabled in the VM.

## Example

```typescript
import { EipNotEnabledError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { Hardfork } from '@tevm/common'

const client = createMemoryClient({ hardfork: Hardfork.London })

try {
  // Attempt an operation that requires an EIP not enabled in London
  await client.call({
    to: '0x...',
    data: '0x...',
    // Assuming this operation requires a post-London EIP
  })
} catch (error) {
  if (error instanceof EipNotEnabledError) {
    console.error('EIP not enabled:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the error, possibly by updating the client to a newer hardfork
  }
}
```

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new EipNotEnabledError**(`message?`, `args?`): `EipNotEnabledError`

Constructs an EipNotEnabledError.

#### Parameters

##### message?

`string` = `'EIP not enabled error occurred.'`

Human-readable error message.

##### args?

[`EipNotEnabledErrorParameters`](../interfaces/EipNotEnabledErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`EipNotEnabledError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

More discriminated version of name. Can be used to discriminate between errors with the same name.

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

### name

> **name**: `string`

#### Inherited from

`ExecutionError.name`

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
