[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / UnreachableCodeError

# Class: UnreachableCodeError

Represents an error that occurs when unreachable code is executed.
This error always indicates a bug in the Tevm VM.

## Example

```javascript
import { UnreachableCodeError } from '@tevm/errors'

function assertUnreachable(x) {
  throw new UnreachableCodeError(x, 'Unreachable code executed')
}

function getArea(shape) {
  switch (shape) {
    case 'circle':
      return Math.PI * Math.pow(radius, 2)
    case 'square':
      return side * side
    default:
      return assertUnreachable(shape)
  }
}

try {
  getArea('triangle') // This should be unreachable
} catch (error) {
  if (error instanceof UnreachableCodeError) {
    console.error('Unreachable code executed:', error.message)
    console.log('Unreachable value:', error.value)
    // This indicates a bug in the Tevm VM
    reportBugToTevmRepository(error)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new UnreachableCodeError**(`value`, `message?`, `args?`): `UnreachableCodeError`

Constructs an UnreachableCodeError.

#### Parameters

##### value

`any`

The value that should be unreachable.

##### message?

`string`

Human-readable error message.

##### args?

[`UnreachableCodeErrorParameters`](../interfaces/UnreachableCodeErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`UnreachableCodeError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

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

### name

> **name**: `string`

#### Inherited from

`InternalError.name`

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

***

### value

> **value**: `any`

The value that should be unreachable.

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
