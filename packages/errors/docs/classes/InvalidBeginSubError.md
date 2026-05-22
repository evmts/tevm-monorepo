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

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Invalid BEGINSUB error occurred.'` | Human-readable error message. |
| `args?` | [`InvalidBeginSubErrorParameters`](../interfaces/InvalidBeginSubErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InvalidBeginSubError'` | Internal error tag. |

#### Returns

`InvalidBeginSubError`

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
