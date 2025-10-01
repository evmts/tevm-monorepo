[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidDepthError

# Class: InvalidDepthError

Represents an error that occurs when the depth parameter is invalid.

This error is typically encountered when a transaction or operation references a depth parameter that is invalid or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidDepthError
} catch (error) {
  if (error instanceof InvalidDepthError) {
    console.error(error.message);
    // Handle the invalid depth error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidDepthError.

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### Constructor

> **new InvalidDepthError**(`message`, `args?`, `tag?`): `InvalidDepthError`

Constructs an InvalidDepthError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidDepthErrorParameters`](../interfaces/InvalidDepthErrorParameters.md) = `{}`

Additional parameters for the InvalidDepthError.

##### tag?

`string` = `'InvalidDepthError'`

The tag for the error.

#### Returns

`InvalidDepthError`

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

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`docsPath`](InvalidParamsError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`metaMessages`](InvalidParamsError.md#metamessages)

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

Error code, analogous to the code in JSON RPC error.

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
