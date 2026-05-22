[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / DefensiveNullCheckError

# Class: DefensiveNullCheckError

Represents an error that occurs when a defensive null check is tripped.
This error should never be thrown and indicates a bug in the Tevm VM if it is thrown.

## Example

```javascript
import { DefensiveNullCheckError } from '@tevm/errors'

function assertNotNull(value, message) {
  if (value === null || value === undefined) {
    throw new DefensiveNullCheckError(message)
  }
  return value
}

try {
  const result = someFunction()
  assertNotNull(result, 'Result should not be null')
} catch (error) {
  if (error instanceof DefensiveNullCheckError) {
    console.error('Unexpected null value:', error.message)
    // This indicates a bug in the Tevm VM
    reportBugToTevmRepository(error)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new DefensiveNullCheckError**(`message?`, `args?`): `DefensiveNullCheckError`

Constructs a DefensiveNullCheckError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message?` | `string` | Human-readable error message. |
| `args?` | [`DefensiveNullCheckErrorParameters`](../interfaces/DefensiveNullCheckErrorParameters.md) | Additional parameters for the error. |

#### Returns

`DefensiveNullCheckError`

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
