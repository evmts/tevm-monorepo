[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidInputLengthError

# Class: InvalidInputLengthError

Represents a calldata/creation error that occurs when an invalid input length is encountered during EVM execution.

Invalid input length errors can occur due to:
- Providing input data of incorrect length.

To debug an invalid input length error:
1. **Review Input Data**: Ensure that the input data provided matches the expected length.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid input length is encountered.

## Example

```typescript
import { InvalidInputLengthError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidInputLengthError
} catch (error) {
  if (error instanceof InvalidInputLengthError) {
    console.error(error.message);
    // Handle the invalid input length error
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

> **new InvalidInputLengthError**(`message?`, `args?`, `tag?`): `InvalidInputLengthError`

Constructs an InvalidInputLengthError.
Represents a calldata/creation error that occurs when an invalid input length is encountered during EVM execution.

Invalid input length errors can occur due to:
- Providing input data of incorrect length.

To debug an invalid input length error:
1. **Review Input Data**: Ensure that the input data provided matches the expected length.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid input length is encountered.

#### Parameters

##### message?

`string` = `'Invalid input length error occurred.'`

Human-readable error message.

##### args?

[`InvalidInputLengthErrorParameters`](../interfaces/InvalidInputLengthErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidInputLengthError'`

The tag for the error.

#### Returns

`InvalidInputLengthError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_INPUT_LENGTH`

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
