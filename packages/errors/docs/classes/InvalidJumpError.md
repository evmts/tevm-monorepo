[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidJumpError

# Class: InvalidJumpError

Represents an invalid bytecode/contract error that occurs when an invalid JUMP operation is executed within the EVM.
This error is typically encountered when the jump destination in the bytecode is invalid or does not exist.

Invalid JUMP errors can occur due to:
- Incorrect jump destinations in the bytecode.
- Bugs in the smart contract code causing jumps to non-existent locations.
- Conditional logic errors leading to unexpected jump destinations.

To debug an invalid JUMP error:
1. **Double Check Bytecode**: Ensure that the bytecode provided is valid.
2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the EVM version you are targeting.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid JUMP occurs.

## Example

```typescript
import { InvalidJumpError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidJumpError
} catch (error) {
  if (error instanceof InvalidJumpError) {
    console.error(error.message);
    // Handle the invalid JUMP error
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

> **new InvalidJumpError**(`message?`, `args?`, `tag?`): `InvalidJumpError`

Constructs an InvalidJumpError.
Represents an invalid bytecode/contract error that occurs when an invalid JUMP operation is executed within the EVM.
This error is typically encountered when the jump destination in the bytecode is invalid or does not exist.

Invalid JUMP errors can occur due to:
- Incorrect jump destinations in the bytecode.
- Bugs in the smart contract code causing jumps to non-existent locations.
- Conditional logic errors leading to unexpected jump destinations.

To debug an invalid JUMP error:
1. **Double Check Bytecode**: Ensure that the bytecode provided is valid.
2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the EVM version you are targeting.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid JUMP occurs.

#### Parameters

##### message?

`string` = `'Invalid JUMP error occurred.'`

Human-readable error message.

##### args?

[`InvalidJumpErrorParameters`](../interfaces/InvalidJumpErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidJumpError'`

Optionally override the name/tag for the error.

#### Returns

`InvalidJumpError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_JUMP`

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
