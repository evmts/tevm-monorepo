[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidParamsError

# Class: InvalidParamsError

Represents an error that occurs when invalid method parameters are provided.

This error is typically encountered when a JSON-RPC request is made with parameters that are not valid or do not match the expected types.

## Example

```ts
try {
  // Some operation that can throw an InvalidParamsError
} catch (error) {
  if (error instanceof InvalidParamsError) {
    console.error(error.message);
    // Handle the invalid params error
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

- [`InvalidAbiError`](InvalidAbiError.md)
- [`InvalidAddToBlockchainError`](InvalidAddToBlockchainError.md)
- [`InvalidAddToMempoolError`](InvalidAddToMempoolError.md)
- [`InvalidArgsError`](InvalidArgsError.md)
- [`InvalidBalanceError`](InvalidBalanceError.md)
- [`InvalidBlobVersionedHashesError`](InvalidBlobVersionedHashesError.md)
- [`InvalidBlockError`](InvalidBlockError.md)
- [`InvalidBytecodeError`](InvalidBytecodeError.md)
- [`InvalidCallerError`](InvalidCallerError.md)
- [`InvalidDataError`](InvalidDataError.md)
- [`InvalidDeployedBytecodeError`](InvalidDeployedBytecodeError.md)
- [`InvalidDepthError`](InvalidDepthError.md)
- [`InvalidFunctionNameError`](InvalidFunctionNameError.md)
- [`InvalidGasLimitError`](InvalidGasLimitError.md)
- [`InvalidGasRefundError`](InvalidGasRefundError.md)
- [`InvalidMaxFeePerGasError`](InvalidMaxFeePerGasError.md)
- [`InvalidMaxPriorityFeePerGasError`](InvalidMaxPriorityFeePerGasError.md)
- [`InvalidNonceError`](InvalidNonceError.md)
- [`InvalidOriginError`](InvalidOriginError.md)
- [`InvalidSaltError`](InvalidSaltError.md)
- [`InvalidSelfdestructError`](InvalidSelfdestructError.md)
- [`InvalidSkipBalanceError`](InvalidSkipBalanceError.md)
- [`InvalidStorageRootError`](InvalidStorageRootError.md)
- [`InvalidToError`](InvalidToError.md)
- [`InvalidUrlError`](InvalidUrlError.md)
- [`InvalidValueError`](InvalidValueError.md)
- [`DecodeFunctionDataError`](DecodeFunctionDataError.md)
- [`EncodeFunctionReturnDataError`](EncodeFunctionReturnDataError.md)

## Constructors

### Constructor

> **new InvalidParamsError**(`message`, `args?`, `tag?`): `InvalidParamsError`

Constructs an InvalidParamsError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidParamsErrorParameters`](../interfaces/InvalidParamsErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidParams'`

The tag for the error.

#### Returns

`InvalidParamsError`

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

> `static` **code**: `number` = `-32602`

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
