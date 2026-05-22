[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidSaltError

# Class: InvalidSaltError

Represents an error that occurs when the salt parameter is invalid.

This error is typically encountered when a transaction or operation references a salt parameter that is invalid or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidSaltError
} catch (error) {
  if (error instanceof InvalidSaltError) {
    console.error(error.message);
    // Handle the invalid salt error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidSaltError.

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new InvalidSaltError**(`message`, `args?`, `tag?`): `InvalidSaltError`

Constructs an InvalidSaltError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`InvalidSaltErrorParameters`](../interfaces/InvalidSaltErrorParameters.md) | `{}` | Additional parameters for the InvalidSaltError. |
| `tag?` | `string` | `'InvalidSaltError'` | The tag for the error. |

#### Returns

`InvalidSaltError`

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
