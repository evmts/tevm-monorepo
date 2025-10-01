[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / RefundExhaustedError

# Class: RefundExhaustedError

Represents an invalid bytecode error that occurs when the gas refund limit is exhausted.
EVM transaction execution metadata level error

Refund exhausted errors can occur due to:
- The transaction exceeding the gas refund limit.

To debug a refund exhausted error:
1. **Review Gas Usage**: Ensure that the gas usage in the contract is within the refund limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify excessive gas usage.

## Example

```typescript
import { RefundExhaustedError } from '@tevm/errors'
try {
  // Some operation that can throw a RefundExhaustedError
} catch (error) {
  if (error instanceof RefundExhaustedError) {
    console.error(error.message);
    // Handle the refund exhausted error
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

> **new RefundExhaustedError**(`message?`, `args?`, `tag?`): `RefundExhaustedError`

Constructs a RefundExhaustedError.
Represents an invalid bytecode error that occurs when the gas refund limit is exhausted.
EVM transaction execution metadata level error

Refund exhausted errors can occur due to:
- The transaction exceeding the gas refund limit.

To debug a refund exhausted error:
1. **Review Gas Usage**: Ensure that the gas usage in the contract is within the refund limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify excessive gas usage.

#### Parameters

##### message?

`string` = `'Refund exhausted error occurred.'`

Human-readable error message.

##### args?

[`RefundExhaustedErrorParameters`](../interfaces/RefundExhaustedErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'RefundExhaustedError'`

The tag for the error.}

#### Returns

`RefundExhaustedError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.REFUND_EXHAUSTED`

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
