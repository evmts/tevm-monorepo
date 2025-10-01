[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / NonceAlreadyUsedError

# Class: NonceAlreadyUsedError

Represents an error that occurs when the specified nonce has already been used.

This error is typically encountered when a transaction is attempted with a nonce that has already been used in a previous transaction.

## Example

```ts
try {
  // Some operation that can throw a NonceAlreadyUsedError
} catch (error) {
  if (error instanceof NonceAlreadyUsedError) {
    console.error(error.message);
    // Handle the nonce already used error
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

> **new NonceAlreadyUsedError**(`message`, `args?`, `tag?`): `NonceAlreadyUsedError`

Constructs a NonceAlreadyUsedError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`NonceAlreadyUsedErrorParameters`](../interfaces/NonceAlreadyUsedErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'NonceAlreadyUsed'`

The tag for the error.

#### Returns

`NonceAlreadyUsedError`

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

> `static` **code**: `number` = `-32008`

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
