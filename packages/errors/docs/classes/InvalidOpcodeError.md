[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidOpcodeError

# Class: InvalidOpcodeError

Represents an invalid bytecode/contract error that occurs when an invalid opcode is encountered during EVM execution.
This error is typically encountered when the bytecode contains an opcode that is not recognized by the EVM.

Invalid opcode errors can occur due to:
- Typographical errors in the bytecode.
- Using opcodes that are not supported by the selected EVM version or hardfork.

To debug an invalid opcode error:
1. **Review Bytecode**: Ensure that the bytecode provided is correct and does not contain any invalid opcodes.
2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the opcodes used by your contract.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid opcode is encountered.
4. **Inspect Contract Code**: Manually inspect the contract code to ensure it compiles correctly and does not include any invalid opcodes.

## Example

```typescript
import { InvalidOpcodeError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidOpcodeError
} catch (error) {
  if (error instanceof InvalidOpcodeError) {
    console.error(error.message);
    // Handle the invalid opcode error
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

> **new InvalidOpcodeError**(`message?`, `args?`, `tag?`): `InvalidOpcodeError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Invalid opcode error occurred.'` | Human-readable error message. |
| `args?` | [`InvalidOpcodeErrorParameters`](../interfaces/InvalidOpcodeErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InvalidOpcodeError'` | Internal error tag. |

#### Returns

`InvalidOpcodeError`

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
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.INVALID_OPCODE` | - | - |

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
