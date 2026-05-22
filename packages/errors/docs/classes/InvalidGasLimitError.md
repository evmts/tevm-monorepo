[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidGasLimitError

# Class: InvalidGasLimitError

Represents an error that occurs when the gas limit is invalid.

This error is typically encountered when a transaction or operation specifies an invalid gas limit.

## Example

```javascript
import { InvalidGasLimitError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient()

try {
  await client.sendTransaction({
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    gasLimit: -1n, // Invalid negative gas limit
  })
} catch (error) {
  if (error instanceof InvalidGasLimitError) {
    console.error('Invalid gas limit:', error.message)
    console.log('Documentation:', error.docsLink)
  }
}
```

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new InvalidGasLimitError**(`message`, `args?`): `InvalidGasLimitError`

Constructs an InvalidGasLimitError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | Human-readable error message. |
| `args?` | [`InvalidGasLimitErrorParameters`](../interfaces/InvalidGasLimitErrorParameters.md) | Additional parameters for the InvalidGasLimitError. |

#### Returns

`InvalidGasLimitError`

#### Overrides

[`InvalidParamsError`](InvalidParamsError.md).[`constructor`](InvalidParamsError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`_tag`](InvalidParamsError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`cause`](InvalidParamsError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`details`](InvalidParamsError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`docsPath`](InvalidParamsError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`metaMessages`](InvalidParamsError.md#metamessages) |
| <a id="name"></a> `name` | `public` | `string` | `undefined` | - | `InvalidParamsError.name` |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`shortMessage`](InvalidParamsError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`InvalidParamsError`](InvalidParamsError.md).[`version`](InvalidParamsError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32602` | The error code for InvalidParamsError. | [`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code-1) |

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

[`InvalidParamsError`](InvalidParamsError.md).[`walk`](InvalidParamsError.md#walk)
