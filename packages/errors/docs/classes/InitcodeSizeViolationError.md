[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InitcodeSizeViolationError

# Class: InitcodeSizeViolationError

Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.

Initcode size violation errors can occur due to:
- Bugs in the smart contract code causing the initcode to exceed the maximum size.
- Issues during the deployment process resulting in oversized initcode.

To debug an initcode size violation error:
1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.

## Example

```typescript
import { InitcodeSizeViolationError } from '@tevm/errors'
try {
  // Some operation that can throw an InitcodeSizeViolationError
} catch (error) {
  if (error instanceof InitcodeSizeViolationError) {
    console.error(error.message);
    // Handle the initcode size violation error
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

> **new InitcodeSizeViolationError**(`message?`, `args?`, `tag?`): `InitcodeSizeViolationError`

Constructs an InitcodeSizeViolationError.
Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.

Initcode size violation errors can occur due to:
- Bugs in the smart contract code causing the initcode to exceed the maximum size.
- Issues during the deployment process resulting in oversized initcode.

To debug an initcode size violation error:
1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.

#### Parameters

##### message?

`string` = `'Initcode size violation error occurred.'`

Human-readable error message.

##### args?

[`InitcodeSizeViolationErrorParameters`](../interfaces/InitcodeSizeViolationErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InitcodeSizeViolationError'`

The tag for the error.

#### Returns

`InitcodeSizeViolationError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INITCODE_SIZE_VIOLATION`

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
