[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidEofFormatError

# Class: InvalidEofFormatError

Represents an error that occurs when an invalid EOF format is encountered during EVM execution.

This error is specific to EOF

Invalid EOF format errors can occur due to:
- Bugs in the smart contract code causing invalid EOF format.
- Issues during the deployment process resulting in invalid EOF format.

To debug an invalid EOF format error:
1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.

## Example

```typescript
import { InvalidEofFormatError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidEofFormatError
} catch (error) {
  if (error instanceof InvalidEofFormatError) {
    console.error(error.message);
    // Handle the invalid EOF format error
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

> **new InvalidEofFormatError**(`message?`, `args?`, `tag?`): `InvalidEofFormatError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Invalid EOF format error occurred.'` | Human-readable error message. |
| `args?` | [`InvalidEofFormatErrorParameters`](../interfaces/InvalidEofFormatErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InvalidEofFormatError'` | Internal error tag. |

#### Returns

`InvalidEofFormatError`

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
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.INVALID_EOF_FORMAT` | - | - |

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
