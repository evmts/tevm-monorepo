[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / PendingTransactionTimeoutError

# Class: PendingTransactionTimeoutError

Represents an error that occurs when a transaction is still pending and has not been included in a block.

This error is typically encountered when a transaction takes too long to be confirmed.

## Example

```ts
try {
  // Some operation that can throw a PendingTransactionTimeoutError
} catch (error) {
  if (error instanceof PendingTransactionTimeoutError) {
    console.error(error.message);
    // Handle the pending transaction timeout error
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

> **new PendingTransactionTimeoutError**(`message`, `args?`, `tag?`): `PendingTransactionTimeoutError`

Constructs a PendingTransactionTimeoutError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`PendingTransactionTimeoutErrorParameters`](../interfaces/PendingTransactionTimeoutErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'PendingTransactionTimeout'`

The tag for the error.

#### Returns

`PendingTransactionTimeoutError`

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
