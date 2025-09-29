[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / MethodNotFoundError

# Class: MethodNotFoundError

Represents an error that occurs when the specified method does not exist or is not available.

This error is typically encountered when a JSON-RPC request is made with a method name that the server does not recognize or support.

## Example

```ts
try {
  // Some operation that can throw a MethodNotFoundError
} catch (error) {
  if (error instanceof MethodNotFoundError) {
    console.error(error.message);
    // Handle the method not found error
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

> **new MethodNotFoundError**(`message`, `args?`, `tag?`): `MethodNotFoundError`

Constructs a MethodNotFoundError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`MethodNotFoundErrorParameters`](../interfaces/MethodNotFoundErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'MethodNotFound'`

The tag for the error.

#### Returns

`MethodNotFoundError`

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

> `static` **code**: `number` = `-32601`

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
