[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / GasLimitExceededError

# Class: GasLimitExceededError

Represents an error that occurs when the gas limit is exceeded.

This error is typically encountered when a transaction or set of transactions exceed the specified gas limit.

## Example

```ts
try {
  // Some operation that can throw a GasLimitExceededError
} catch (error) {
  if (error instanceof GasLimitExceededError) {
    console.error(error.message);
    // Handle the gas limit exceeded error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Extended by

- [`CodeSizeExceedsMaximumError`](CodeSizeExceedsMaximumError.md)
- [`CodeStoreOutOfGasError`](CodeStoreOutOfGasError.md)
- [`OutOfGasError`](OutOfGasError.md)

## Constructors

### Constructor

> **new GasLimitExceededError**(`message`, `args?`, `tag?`): `GasLimitExceededError`

Constructs a GasLimitExceededError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`GasLimitExceededErrorParameters`](../interfaces/GasLimitExceededErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'GasLimitExceeded'`

The tag for the error.

#### Returns

`GasLimitExceededError`

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

> `static` **code**: `number` = `-32003`

Error code (-32003), indicating a transaction rejection.

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
