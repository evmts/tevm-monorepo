[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / DecodeFunctionDataError

# Class: DecodeFunctionDataError

Represents an error that occurs when decoding function data fails.
Not expected to be thrown unless ABI is incorrect.

## Example

```javascript
import { DecodeFunctionDataError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient()

try {
  const result = await client.call({
    to: '0x1234567890123456789012345678901234567890',
    data: '0x...' // Invalid or mismatched function data
  })
} catch (error) {
  if (error instanceof DecodeFunctionDataError) {
    console.error('Decode function data error:', error.message)
    console.log('Documentation:', error.docsLink)
  }
}
```

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new DecodeFunctionDataError**(`message`, `args?`): `DecodeFunctionDataError`

Constructs a DecodeFunctionDataError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

`DecodeFunctionDataErrorParameters` = `{}`

Additional parameters for the DecodeFunctionDataError.

#### Returns

`DecodeFunctionDataError`

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
