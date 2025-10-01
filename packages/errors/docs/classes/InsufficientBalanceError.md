[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InsufficientBalanceError

# Class: InsufficientBalanceError

Represents an error that occurs when an account has insufficient balance to perform a transaction.
EVM transaction execution metadata level error

Insufficient balance errors can occur due to:
- Attempting to transfer or spend more funds than available in the account.

To debug an insufficient balance error:
1. **Review Account Balance**: Ensure that the account has sufficient funds to cover the transaction.
2. **Check Transaction Details**: Verify the transaction amount and ensure it does not exceed the account balance.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction execution and identify where the insufficient balance occurs.

## Example

```typescript
import { InsufficientBalanceError } from '@tevm/errors'
try {
  // Some operation that can throw an InsufficientBalanceError
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error(error.message);
    // Handle the insufficient balance error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new InsufficientBalanceError**(`message?`, `args?`, `tag?`): `InsufficientBalanceError`

Constructs an InsufficientBalanceError.
Represents an error that occurs when an account has insufficient balance to perform a transaction.
EVM transaction execution metadata level error

Insufficient balance errors can occur due to:
- Attempting to transfer or spend more funds than available in the account.

To debug an insufficient balance error:
1. **Review Account Balance**: Ensure that the account has sufficient funds to cover the transaction.
2. **Check Transaction Details**: Verify the transaction amount and ensure it does not exceed the account balance.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction execution and identify where the insufficient balance occurs.

#### Parameters

##### message?

`string` = `'Insufficient balance error occurred.'`

Human-readable error message.

##### args?

[`InsufficientBalanceErrorParameters`](../interfaces/InsufficientBalanceErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InsufficientBalanceError'`

The tag for the error.

#### Returns

`InsufficientBalanceError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

***

### code

> `static` **code**: `number` = `-32015`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INSUFFICIENT_BALANCE`

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

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)
