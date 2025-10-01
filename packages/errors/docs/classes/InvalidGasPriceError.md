[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidGasPriceError

# Class: InvalidGasPriceError

Represents an error that occurs when the specified gas price is invalid.

This error is typically encountered when a transaction is submitted with a gas price that is not acceptable by the Ethereum network.

## Example

```ts
try {
  // Some operation that can throw an InvalidGasPriceError
} catch (error) {
  if (error instanceof InvalidGasPriceError) {
    console.error(error.message);
    // Handle the invalid gas price error
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

> **new InvalidGasPriceError**(`message`, `args?`, `tag?`): `InvalidGasPriceError`

Constructs an InvalidGasPriceError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidGasPriceErrorParameters`](../interfaces/InvalidGasPriceErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidGasPrice'`

The tag for the error.

#### Returns

`InvalidGasPriceError`

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

> `static` **code**: `number` = `-32012`

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
