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

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`InvalidParamsErrorParameters`](../interfaces/InvalidParamsErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'InvalidParams'` | The tag for the error. |

#### Returns

`InvalidParamsError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`BaseError`](BaseError.md).[`cause`](BaseError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`BaseError`](BaseError.md).[`code`](BaseError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`details`](BaseError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32602` | The error code for InvalidParamsError. | - |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)
