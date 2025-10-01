[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ValueOverflowError

# Class: ValueOverflowError

Represents an invalid bytecode/contract error that occurs when a value overflow happens during EVM execution.

Value overflow errors can occur due to:
- Arithmetic operations that exceed the maximum value limit.

To debug a value overflow error:
1. **Review Arithmetic Operations**: Ensure that arithmetic operations are correctly handling large numbers and preventing overflow.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the overflow occurs.

## Example

```typescript
import { ValueOverflowError } from '@tevm/errors'
try {
  // Some operation that can throw a ValueOverflowError
} catch (error) {
  if (error instanceof ValueOverflowError) {
    console.error(error.message);
    // Handle the value overflow error
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

> **new ValueOverflowError**(`message?`, `args?`, `tag?`): `ValueOverflowError`

Constructs a ValueOverflowError.
Represents an invalid bytecode/contract error that occurs when a value overflow happens during EVM execution.

Value overflow errors can occur due to:
- Arithmetic operations that exceed the maximum value limit.

To debug a value overflow error:
1. **Review Arithmetic Operations**: Ensure that arithmetic operations are correctly handling large numbers and preventing overflow.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the overflow occurs.

#### Parameters

##### message?

`string` = `'Value overflow error occurred.'`

Human-readable error message.

##### args?

[`ValueOverflowErrorParameters`](../interfaces/ValueOverflowErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ValueOverflowError'`

The tag for the error.

#### Returns

`ValueOverflowError`

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

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.VALUE_OVERFLOW`

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
