[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidDataError

# Class: InvalidDataError

Represents an error that occurs when the data provided is invalid.

This error is typically encountered when an operation receives invalid or malformed data.

## Example

```javascript
import { InvalidDataError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient()

try {
  await client.sendTransaction({
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    data: 'not_valid_hex_data', // Should be a valid hex string
  })
} catch (error) {
  if (error instanceof InvalidDataError) {
    console.error('Invalid data:', error.message)
    console.log('Documentation:', error.docsLink)
  }
}
```

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new InvalidDataError**(`message`, `args?`): `InvalidDataError`

Constructs an InvalidDataError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidDataErrorParameters`](../interfaces/InvalidDataErrorParameters.md) = `{}`

Additional parameters for the InvalidDataError.

#### Returns

`InvalidDataError`

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
