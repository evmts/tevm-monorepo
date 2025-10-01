[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidBeginSubError

# Class: InvalidBeginSubError

Represents an invalid bytecode/contract error that occurs when an invalid BEGINSUB operation is executed within the EVM.

Invalid BEGINSUB errors can occur due to:
- Incorrect use of the BEGINSUB opcode.
- Bugs in the smart contract code causing invalid subroutine execution.

To debug an invalid BEGINSUB error:
1. **Review Subroutine Logic**: Ensure that the BEGINSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid BEGINSUB occurs.

## Example

```typescript
import { InvalidBeginSubError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidBeginSubError
} catch (error) {
  if (error instanceof InvalidBeginSubError) {
    console.error(error.message);
    // Handle the invalid BEGINSUB error
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

> **new InvalidBeginSubError**(`message?`, `args?`, `tag?`): `InvalidBeginSubError`

Constructs an InvalidBeginSubError.
Represents an invalid bytecode/contract error that occurs when an invalid BEGINSUB operation is executed within the EVM.

Invalid BEGINSUB errors can occur due to:
- Incorrect use of the BEGINSUB opcode.
- Bugs in the smart contract code causing invalid subroutine execution.

To debug an invalid BEGINSUB error:
1. **Review Subroutine Logic**: Ensure that the BEGINSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid BEGINSUB occurs.

#### Parameters

##### message?

`string` = `'Invalid BEGINSUB error occurred.'`

Human-readable error message.

##### args?

[`InvalidBeginSubErrorParameters`](../interfaces/InvalidBeginSubErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidBeginSubError'`

The tag for the error.

#### Returns

`InvalidBeginSubError`

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
