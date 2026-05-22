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

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Invalid bytecode result error occurred.'` | Human-readable error message. |
| `args?` | [`InvalidBytecodeResultErrorParameters`](../interfaces/InvalidBytecodeResultErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InvalidBytecodeResultError'` | Internal error tag. |

#### Returns

`InvalidBytecodeResultError`

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
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.INVALID_BYTECODE_RESULT` | - | - |

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
