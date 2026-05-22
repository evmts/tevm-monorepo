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

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | The value that should be unreachable. |
| `message?` | `string` | Human-readable error message. |
| `args?` | [`UnreachableCodeErrorParameters`](../interfaces/UnreachableCodeErrorParameters.md) | Additional parameters for the error. |

#### Returns

`UnreachableCodeError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`InternalError`](InternalError.md).[`cause`](InternalError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`InternalError`](InternalError.md).[`code`](InternalError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`details`](InternalError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath) |
| <a id="meta"></a> `meta` | `public` | `object` \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`meta`](InternalError.md#meta) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages) |
| <a id="name"></a> `name` | `public` | `string` | `undefined` | - | `InternalError.name` |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage) |
| <a id="value"></a> `value` | `public` | `any` | `undefined` | The value that should be unreachable. | - |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`version`](InternalError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32603` | The error code for InternalError. | [`InternalError`](InternalError.md).[`code`](InternalError.md#code-1) |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)
