[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidBytecodeResultError

# Class: InvalidBytecodeResultError

Represents a calldata/creation error that occurs when invalid bytecode is deployed during EVM execution.

Invalid bytecode result errors can occur due to:
- Bugs in the smart contract code causing invalid bytecode to be generated.
- Issues during the deployment process resulting in invalid bytecode.

To debug an invalid bytecode result error:
1. **Review Deployment Process**: Ensure that the bytecode being deployed is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid bytecode is generated or deployed.

## Example

```typescript
import { InvalidBytecodeResultError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidBytecodeResultError
} catch (error) {
  if (error instanceof InvalidBytecodeResultError) {
    console.error(error.message);
    // Handle the invalid bytecode result error
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

> **new InvalidBytecodeResultError**(`message?`, `args?`, `tag?`): `InvalidBytecodeResultError`

Constructs an InvalidBytecodeResultError.
Represents a calldata/creation error that occurs when invalid bytecode is deployed during EVM execution.

Invalid bytecode result errors can occur due to:
- Bugs in the smart contract code causing invalid bytecode to be generated.
- Issues during the deployment process resulting in invalid bytecode.

To debug an invalid bytecode result error:
1. **Review Deployment Process**: Ensure that the bytecode being deployed is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid bytecode is generated or deployed.

#### Parameters

##### message?

`string` = `'Invalid bytecode result error occurred.'`

Human-readable error message.

##### args?

[`InvalidBytecodeResultErrorParameters`](../interfaces/InvalidBytecodeResultErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidBytecodeResultError'`

The tag for the error.

#### Returns

`InvalidBytecodeResultError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_BYTECODE_RESULT`

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
