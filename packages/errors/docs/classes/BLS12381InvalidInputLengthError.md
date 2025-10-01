[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BLS12381InvalidInputLengthError

# Class: BLS12381InvalidInputLengthError

Represents an EIP-2537 specific error that occurs when an invalid input length is encountered during BLS12-381 operations.

Invalid input length errors can occur due to:
- Providing input data of incorrect length for BLS12-381 operations.

## Example

```typescript
import { BLS12381InvalidInputLengthError } from '@tevm/errors'
try {
  // Some operation that can throw a BLS12381InvalidInputLengthError
} catch (error) {
  if (error instanceof BLS12381InvalidInputLengthError) {
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

> **new BLS12381InvalidInputLengthError**(`message?`, `args?`, `tag?`): `BLS12381InvalidInputLengthError`

Constructs a BLS12381InvalidInputLengthError.
Represents an EIP-2537 specific error that occurs when an invalid input length is encountered during BLS12-381 operations.

Invalid input length errors can occur due to:
- Providing input data of incorrect length for BLS12-381 operations.

#### Parameters

##### message?

`string` = `'BLS12-381 invalid input length error occurred.'`

Human-readable error message.

##### args?

[`BLS12381InvalidInputLengthErrorParameters`](../interfaces/BLS12381InvalidInputLengthErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'BLS12381InvalidInputLengthError'`

The tag for the error.

#### Returns

`BLS12381InvalidInputLengthError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.BLS_12_381_INVALID_INPUT_LENGTH`

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
