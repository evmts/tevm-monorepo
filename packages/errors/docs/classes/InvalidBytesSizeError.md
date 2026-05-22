[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidBytesSizeError

# Class: InvalidBytesSizeError

Represents an error that occurs when the size of the bytes does not match the expected size.

## Example

```javascript
import { InvalidBytesSizeError } from '@tevm/errors'
import { hexToBytes } from '@tevm/utils'

function requireBytes32(value) {
  const bytes = hexToBytes(value)
  if (bytes.length !== 32) {
    throw new InvalidBytesSizeError(bytes.length, 32)
  }
  return bytes
}

try {
  requireBytes32('0x1234') // This will throw an InvalidBytesSizeError
} catch (error) {
  if (error instanceof InvalidBytesSizeError) {
    console.error(`Invalid bytes size: ${error.message}`)
    console.log(`Actual size: ${error.size}, Expected size: ${error.expectedSize}`)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new InvalidBytesSizeError**(`size`, `expectedSize`, `message?`, `args?`): `InvalidBytesSizeError`

Constructs an InvalidBytesSizeError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | The actual size of the bytes. |
| `expectedSize` | `number` | The expected size of the bytes. |
| `message?` | `string` | Human-readable error message. |
| `args?` | [`InvalidBytesSizeErrorParameters`](../interfaces/InvalidBytesSizeErrorParameters.md) | Additional parameters for the error. |

#### Returns

`InvalidBytesSizeError`

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
| <a id="expectedsize"></a> `expectedSize` | `public` | `number` | `undefined` | The expected size of the bytes. | - |
| <a id="meta"></a> `meta` | `public` | `object` \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`meta`](InternalError.md#meta) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages) |
| <a id="name"></a> `name` | `public` | `string` | `undefined` | - | `InternalError.name` |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage) |
| <a id="size"></a> `size` | `public` | `number` | `undefined` | The actual size of the bytes. | - |
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
