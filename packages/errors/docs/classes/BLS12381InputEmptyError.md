[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BLS12381InputEmptyError

# Class: BLS12381InputEmptyError

Represents an EIP-2537 specific error that occurs when an input is empty during BLS12-381 operations.

Input empty errors can occur due to:
- Providing empty input data for BLS12-381 operations.

## Example

```typescript
import { BLS12381InputEmptyError } from '@tevm/errors'
try {
  // Some operation that can throw a BLS12381InputEmptyError
} catch (error) {
  if (error instanceof BLS12381InputEmptyError) {
    console.error(error.message);
    // Handle the input empty error
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

> **new BLS12381InputEmptyError**(`message?`, `args?`, `tag?`): `BLS12381InputEmptyError`

Constructs a BLS12381InputEmptyError.
Represents an EIP-2537 specific error that occurs when an input is empty during BLS12-381 operations.

Input empty errors can occur due to:
- Providing empty input data for BLS12-381 operations.

#### Parameters

##### message?

`string` = `'BLS12-381 input empty error occurred.'`

Human-readable error message.

##### args?

[`BLS12381InputEmptyErrorParameters`](../interfaces/BLS12381InputEmptyErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'BLS12381InputEmptyError'`

The tag for the error.

#### Returns

`BLS12381InputEmptyError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.BLS_12_381_INPUT_EMPTY`

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
