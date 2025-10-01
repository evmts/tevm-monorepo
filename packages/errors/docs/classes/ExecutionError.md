[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ExecutionError

# Class: ExecutionError

Represents an error that occurs when an execution error happens on the Ethereum node.

This error is typically encountered when there is a general execution error that does not fit more specific categories.
The error code -32015 is a non-standard extension used for EVM execution errors.

## Example

```ts
try {
  // Some operation that can throw an ExecutionError
} catch (error) {
  if (error instanceof ExecutionError) {
    console.error(error.message);
    // Handle the execution error
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

- [`CommonMismatchError`](CommonMismatchError.md)
- [`EipNotEnabledError`](EipNotEnabledError.md)
- [`AuthCallUnsetError`](AuthCallUnsetError.md)
- [`BLS12381FpNotInFieldError`](BLS12381FpNotInFieldError.md)
- [`BLS12381InputEmptyError`](BLS12381InputEmptyError.md)
- [`BLS12381InvalidInputLengthError`](BLS12381InvalidInputLengthError.md)
- [`BLS12381PointNotOnCurveError`](BLS12381PointNotOnCurveError.md)
- [`CreateCollisionError`](CreateCollisionError.md)
- [`InitcodeSizeViolationError`](InitcodeSizeViolationError.md)
- [`InsufficientBalanceError`](InsufficientBalanceError.md)
- [`InvalidBeginSubError`](InvalidBeginSubError.md)
- [`InvalidBytecodeResultError`](InvalidBytecodeResultError.md)
- [`InvalidCommitmentError`](InvalidCommitmentError.md)
- [`InvalidEofFormatError`](InvalidEofFormatError.md)
- [`InvalidInputLengthError`](InvalidInputLengthError.md)
- [`InvalidJumpError`](InvalidJumpError.md)
- [`InvalidJumpSubError`](InvalidJumpSubError.md)
- [`InvalidKzgInputsError`](InvalidKzgInputsError.md)
- [`InvalidOpcodeError`](InvalidOpcodeError.md)
- [`InvalidProofError`](InvalidProofError.md)
- [`InvalidReturnSubError`](InvalidReturnSubError.md)
- [`OutOfRangeError`](OutOfRangeError.md)
- [`RefundExhaustedError`](RefundExhaustedError.md)
- [`StackOverflowError`](StackOverflowError.md)
- [`StackUnderflowError`](StackUnderflowError.md)
- [`StaticStateChangeError`](StaticStateChangeError.md)
- [`StopError`](StopError.md)
- [`ValueOverflowError`](ValueOverflowError.md)

## Constructors

### Constructor

> **new ExecutionError**(`message`, `args?`, `tag?`): `ExecutionError`

Constructs an ExecutionError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ExecutionErrorParameters`](../interfaces/ExecutionErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ExecutionError'`

The tag for the error.

#### Returns

`ExecutionError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

More discriminated version of name. Can be used to discriminate between errors with the same name.

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

> `static` **code**: `number` = `-32015`

Error code (-32015), a convention for EVM execution errors.

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
