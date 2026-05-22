[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / OutOfRangeError

# Class: OutOfRangeError

Represents an invalid bytecode/contract error that occurs when a value is out of the allowable range during EVM execution.
This error is typically encountered when an operation results in a value that exceeds the allowed limits.

Value out of range errors can occur due to:
- Arithmetic operations that result in overflow or underflow.
- Incorrect handling of large numbers in the smart contract code.
- Bugs in the smart contract code causing values to exceed their expected range.

To debug a value out of range error:
1. **Review Arithmetic Operations**: Ensure that arithmetic operations in the contract are correctly handling large numbers and preventing overflow/underflow.
2. **Check Value Assignments**: Verify that values assigned to variables are within the allowable range and properly validated.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the value goes out of range.
4. **Inspect Contract Logic**: Manually inspect the contract code to ensure that all value assignments and operations are within the expected limits.

## Example

```typescript
import { OutOfRangeError } from '@tevm/errors'
try {
  // Some operation that can throw an OutOfRangeError
} catch (error) {
  if (error instanceof OutOfRangeError) {
    console.error(error.message);
    // Handle the value out of range error
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

> **new OutOfRangeError**(`message?`, `args?`, `tag?`): `OutOfRangeError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Value out of range error occurred.'` | Human-readable error message. |
| `args?` | [`OutOfRangeErrorParameters`](../interfaces/OutOfRangeErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'OutOfRangeError'` | Internal error tag. |

#### Returns

`OutOfRangeError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32015` | The error code for ExecutionError. | [`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.OUT_OF_RANGE` | - | - |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)
