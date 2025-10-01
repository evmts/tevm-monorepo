[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / MisconfiguredClientError

# Class: MisconfiguredClientError

Represents an error that occurs when the Client is misconfigured.

This error can be thrown when:
- Incorrect configuration parameters are provided when creating a Client.
- The Client is used in a way that's incompatible with its configuration.

## Example

```typescript
import { createMemoryClient } from '@tevm/memory-client'
import { MisconfiguredClientError } from '@tevm/errors'

const memoryClient = createMemoryClient({
  // Assume we've misconfigured something here
})

try {
  await memoryClient.tevmCall({
    to: '0x...',
    data: '0x...',
  })
} catch (error) {
  if (error instanceof MisconfiguredClientError) {
    console.error('Client misconfiguration:', error.message)
    console.log('Documentation:', error.docsLink)
    // Attempt to recreate the client with correct configuration
    // or notify the user to check their client setup
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new MisconfiguredClientError**(`message?`, `args?`): `MisconfiguredClientError`

Constructs a MisconfiguredClientError.

#### Parameters

##### message?

`string` = `'Misconfigured client error occurred.'`

Human-readable error message.

##### args?

[`MisconfiguredClientErrorParameters`](../interfaces/MisconfiguredClientErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`MisconfiguredClientError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

***

### code

> `static` **code**: `number` = `-32603`

The error code for InternalError.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code-1)

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

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)
