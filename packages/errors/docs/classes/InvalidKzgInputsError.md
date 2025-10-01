[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidKzgInputsError

# Class: InvalidKzgInputsError

Represents an EIP-4844 specific error that occurs when KZG inputs are invalid.

Invalid inputs errors can occur due to:
- Providing invalid KZG inputs that do not meet the expected criteria.

## Example

```typescript
import { InvalidKzgInputsError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidKzgInputsError
} catch (error) {
  if (error instanceof InvalidKzgInputsError) {
    console.error(error.message);
    // Handle the invalid inputs error
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

> **new InvalidKzgInputsError**(`message?`, `args?`, `tag?`): `InvalidKzgInputsError`

Constructs an InvalidKzgInputsError.
Represents an EIP-4844 specific error that occurs when KZG inputs are invalid.

Invalid inputs errors can occur due to:
- Providing invalid KZG inputs that do not meet the expected criteria.

#### Parameters

##### message?

`string` = `'Invalid inputs error occurred.'`

Human-readable error message.

##### args?

[`InvalidKzgInputsErrorParameters`](../interfaces/InvalidKzgInputsErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidKzgInputsError'`

The tag for the error.}

#### Returns

`InvalidKzgInputsError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_INPUTS`

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
