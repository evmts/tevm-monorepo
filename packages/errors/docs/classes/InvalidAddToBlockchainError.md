[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidAddToBlockchainError

# Class: InvalidAddToBlockchainError

Represents an error that occurs when the addToBlockchain parameter is invalid.

This error is typically encountered when a transaction specifies an invalid addToBlockchain value.

## Example

```javascript
import { InvalidAddToBlockchainError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient()

try {
  await client.call({
    to: '0x0987654321098765432109876543210987654321',
    data: '0x',
    addToBlockchain: 'invalid', // Should be boolean
  })
} catch (error) {
  if (error instanceof InvalidAddToBlockchainError) {
    console.error('Invalid addToBlockchain parameter:', error.message)
  }
}
```

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new InvalidAddToBlockchainError**(`message`, `args?`): `InvalidAddToBlockchainError`

Constructs an InvalidAddToBlockchainError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidAddToBlockchainErrorParameters`](../interfaces/InvalidAddToBlockchainErrorParameters.md) = `{}`

Additional parameters for the InvalidAddToBlockchainError.

#### Returns

`InvalidAddToBlockchainError`

#### Overrides

[`InvalidParamsError`](InvalidParamsError.md).[`constructor`](InvalidParamsError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`_tag`](InvalidParamsError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`cause`](InvalidParamsError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`details`](InvalidParamsError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`docsPath`](InvalidParamsError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`metaMessages`](InvalidParamsError.md#metamessages)

***

### name

> **name**: `string`

#### Inherited from

`InvalidParamsError.name`

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`shortMessage`](InvalidParamsError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`version`](InvalidParamsError.md#version)

***

### code

> `static` **code**: `number` = `-32602`

The error code for InvalidParamsError.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code-1)

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

[`InvalidParamsError`](InvalidParamsError.md).[`walk`](InvalidParamsError.md#walk)
