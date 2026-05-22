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

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Invalid JUMP error occurred.'` | Human-readable error message. |
| `args?` | [`InvalidJumpErrorParameters`](../interfaces/InvalidJumpErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InvalidJumpError'` | Internal error tag. |

#### Returns

`InvalidJumpError`

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
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.INVALID_JUMP` | - | - |

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
