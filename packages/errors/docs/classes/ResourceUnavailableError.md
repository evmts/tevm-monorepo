[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ResourceUnavailableError

# Class: ResourceUnavailableError

Represents an error that occurs when the requested resource is temporarily unavailable.

This error is typically encountered when a JSON-RPC request is made for a resource that is temporarily unavailable due to server issues or other reasons.

## Example

```ts
try {
  // Some operation that can throw a ResourceUnavailableError
} catch (error) {
  if (error instanceof ResourceUnavailableError) {
    console.error(error.message);
    // Handle the resource unavailable error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new ResourceUnavailableError**(`message`, `args?`, `tag?`): `ResourceUnavailableError`

Constructs a ResourceUnavailableError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ResourceUnavailableErrorParameters`](../interfaces/ResourceUnavailableErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ResourceUnavailable'`

The tag for the error.

#### Returns

`ResourceUnavailableError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

***

### code

> `static` **code**: `number` = `-32002`

Error code, analogous to the code in JSON RPC error.

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)
