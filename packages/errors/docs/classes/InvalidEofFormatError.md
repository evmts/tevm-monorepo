[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidEofFormatError

# Class: InvalidEofFormatError

Represents an error that occurs when an invalid EOF format is encountered during EVM execution.

This error is specific to EOF

Invalid EOF format errors can occur due to:
- Bugs in the smart contract code causing invalid EOF format.
- Issues during the deployment process resulting in invalid EOF format.

To debug an invalid EOF format error:
1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.

## Example

```typescript
import { InvalidEofFormatError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidEofFormatError
} catch (error) {
  if (error instanceof InvalidEofFormatError) {
    console.error(error.message);
    // Handle the invalid EOF format error
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

> **new InvalidEofFormatError**(`message?`, `args?`, `tag?`): `InvalidEofFormatError`

Constructs an InvalidEofFormatError.
Represents an error that occurs when an invalid EOF format is encountered during EVM execution.

This error is specific to EOF

Invalid EOF format errors can occur due to:
- Bugs in the smart contract code causing invalid EOF format.
- Issues during the deployment process resulting in invalid EOF format.

To debug an invalid EOF format error:
1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.

#### Parameters

##### message?

`string` = `'Invalid EOF format error occurred.'`

Human-readable error message.

##### args?

[`InvalidEofFormatErrorParameters`](../interfaces/InvalidEofFormatErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidEofFormatError'`

The tag for the error.

#### Returns

`InvalidEofFormatError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_EOF_FORMAT`

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
