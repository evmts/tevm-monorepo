[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidJumpSubError

# Class: InvalidJumpSubError

Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.

Invalid JUMPSUB errors can occur due to:
- Incorrect use of the JUMPSUB opcode.
- Bugs in the smart contract code causing invalid subroutine jumps.

To debug an invalid JUMPSUB error:
1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.

## Example

```typescript
import { InvalidJumpSubError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidJumpSubError
} catch (error) {
  if (error instanceof InvalidJumpSubError) {
    console.error(error.message);
    // Handle the invalid JUMPSUB error
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

> **new InvalidJumpSubError**(`message?`, `args?`, `tag?`): `InvalidJumpSubError`

Constructs an InvalidJumpSubError.
Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.

Invalid JUMPSUB errors can occur due to:
- Incorrect use of the JUMPSUB opcode.
- Bugs in the smart contract code causing invalid subroutine jumps.

To debug an invalid JUMPSUB error:
1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.

#### Parameters

##### message?

`string` = `'Invalid JUMPSUB error occurred.'`

Human-readable error message.

##### args?

[`InvalidJumpSubErrorParameters`](../interfaces/InvalidJumpSubErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidJumpSubError'`

The tag for the error.}

#### Returns

`InvalidJumpSubError`

#### Example

```typescript
import { InvalidJumpSubError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidJumpSubError
} catch (error) {
  if (error instanceof InvalidJumpSubError) {
    console.error(error.message);
    // Handle the invalid JUMPSUB error
  }
}
```

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
