[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BLS12381FpNotInFieldError

# Class: BLS12381FpNotInFieldError

Represents an EIP-2537 specific error that occurs when an fp point is not in the field during BLS12-381 operations.

Fp point not in field errors can occur due to:
- Providing an fp point that does not lie within the expected field for BLS12-381 operations.

## Example

```typescript
import { BLS12381FpNotInFieldError } from '@tevm/errors'
try {
  // Some operation that can throw a BLS12381FpNotInFieldError
} catch (error) {
  if (error instanceof BLS12381FpNotInFieldError) {
    console.error(error.message);
    // Handle the fp point not in field error
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

> **new BLS12381FpNotInFieldError**(`message?`, `args?`, `tag?`): `BLS12381FpNotInFieldError`

Constructs a BLS12381FpNotInFieldError.
Represents an EIP-2537 specific error that occurs when an fp point is not in the field during BLS12-381 operations.

Fp point not in field errors can occur due to:
- Providing an fp point that does not lie within the expected field for BLS12-381 operations.

#### Parameters

##### message?

`string` = `'BLS12-381 fp point not in field error occurred.'`

Human-readable error message.

##### args?

[`BLS12381FpNotInFieldErrorParameters`](../interfaces/BLS12381FpNotInFieldErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'BLS12381FpNotInFieldError'`

The tag for the error.

#### Returns

`BLS12381FpNotInFieldError`

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

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD`

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
