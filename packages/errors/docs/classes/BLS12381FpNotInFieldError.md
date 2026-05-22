[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BLS12381FpNotInFieldError

# Class: BLS12381FpNotInFieldError

Represents an EIP-2537 specific error that occurs when an fp point is not in the field during BLS12-381 operations.

Fp point not in field errors can occur due to:
- Providing an fp point that does not lie within the expected field for BLS12-381 operations.

## Example

```typescript
import { BLS12381FpNotInFieldError } from '@tevm/errors'
try {
  // Some operation that can throw a BLS12381FpNotInFieldError
} catch (error) {
  if (error instanceof BLS12381FpNotInFieldError) {
    console.error(error.message);
    // Handle the fp point not in field error
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

> **new BLS12381FpNotInFieldError**(`message?`, `args?`, `tag?`): `BLS12381FpNotInFieldError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'BLS12-381 fp point not in field error occurred.'` | Human-readable error message. |
| `args?` | [`BLS12381FpNotInFieldErrorParameters`](../interfaces/BLS12381FpNotInFieldErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'BLS12381FpNotInFieldError'` | Internal error tag. |

#### Returns

`BLS12381FpNotInFieldError`

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
| <a id="meta"></a> `meta` | `public` | `object` \| `undefined` | `undefined` | - | - |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32015` | The error code for ExecutionError. | [`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD` | - | - |

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
