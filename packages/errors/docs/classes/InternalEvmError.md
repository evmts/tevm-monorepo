[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InternalEvmError

# Class: InternalEvmError

Represents an internal error within the EVM. This error should not typically happen
This error is typically encountered when there is an unexpected issue within the EVM execution or client.

Internal errors can occur due to:
- Bugs in the EVM implementation.
- Bugs in Tevm

If you encounter this error please open an issue on the Tevm GitHub repository.

## Example

```typescript
import { InternalEvmError } from '@tevm/errors'
try {
  // Some operation that can throw an InternalEvmError
} catch (error) {
  if (error instanceof InternalEvmError) {
    console.error(error.message);
    // Handle the internal error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new InternalEvmError**(`message?`, `args?`, `tag?`): `InternalEvmError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Internal error occurred.'` | Human-readable error message. |
| `args?` | [`InternalEvmErrorParameters`](../interfaces/InternalEvmErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'InternalEvmError'` | Internal error tag. |

#### Returns

`InternalEvmError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | [`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | [`BaseError`](BaseError.md).[`cause`](BaseError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | [`BaseError`](BaseError.md).[`code`](BaseError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | [`BaseError`](BaseError.md).[`details`](BaseError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | [`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | [`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.INTERNAL_ERROR` | - |

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)
