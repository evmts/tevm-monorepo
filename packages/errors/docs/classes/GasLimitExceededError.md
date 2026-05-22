[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / GasLimitExceededError

# Class: GasLimitExceededError

Represents an error that occurs when the gas limit is exceeded.

This error is typically encountered when a transaction or set of transactions exceed the specified gas limit.

## Example

```ts
try {
  // Some operation that can throw a GasLimitExceededError
} catch (error) {
  if (error instanceof GasLimitExceededError) {
    console.error(error.message);
    // Handle the gas limit exceeded error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Extended by

- [`CodeSizeExceedsMaximumError`](CodeSizeExceedsMaximumError.md)
- [`CodeStoreOutOfGasError`](CodeStoreOutOfGasError.md)
- [`OutOfGasError`](OutOfGasError.md)

## Constructors

### Constructor

> **new GasLimitExceededError**(`message`, `args?`, `tag?`): `GasLimitExceededError`

Constructs a GasLimitExceededError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`GasLimitExceededErrorParameters`](../interfaces/GasLimitExceededErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'GasLimitExceeded'` | The tag for the error. |

#### Returns

`GasLimitExceededError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`BaseError`](BaseError.md).[`cause`](BaseError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`BaseError`](BaseError.md).[`code`](BaseError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`details`](BaseError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32003` | The error code for GasLimitExceededError. | - |

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
