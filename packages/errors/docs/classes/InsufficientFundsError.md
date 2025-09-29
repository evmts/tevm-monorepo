[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InsufficientFundsError

# Class: InsufficientFundsError

Represents an error that occurs when there are insufficient funds for a transaction.

This error is typically encountered when a transaction is attempted with a balance that is too low to cover the transaction cost.

The error code -32003 is a standard Ethereum JSON-RPC error code indicating a transaction rejected,
which is used when a transaction is not accepted for processing due to validation failures
such as insufficient funds.

## Example

```ts
try {
  // Some operation that can throw an InsufficientFundsError
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.error(error.message);
    // Handle the insufficient funds error
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

> **new InsufficientFundsError**(`message`, `args?`, `tag?`): `InsufficientFundsError`

Constructs an InsufficientFundsError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InsufficientFundsErrorParameters`](../interfaces/InsufficientFundsErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InsufficientFunds'`

The tag for the error.

#### Returns

`InsufficientFundsError`

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

Error code (-32003), standard Ethereum JSON-RPC error code for transaction rejected.

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
