[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InsufficientFundsError

# Class: InsufficientFundsError

Represents an error that occurs when there are insufficient funds for a transaction.

This error is typically encountered when a transaction is attempted with a balance that is too low to cover the transaction cost.

The error code -32003 is a standard Ethereum JSON-RPC error code indicating a transaction rejected,
which is used when a transaction is not accepted for processing due to validation failures
such as insufficient funds.

## Example

```ts
try {
  // Some operation that can throw an InsufficientFundsError
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.error(error.message);
    // Handle the insufficient funds error
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

> **new InsufficientFundsError**(`message`, `args?`, `tag?`): `InsufficientFundsError`

Constructs an InsufficientFundsError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`InsufficientFundsErrorParameters`](../interfaces/InsufficientFundsErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'InsufficientFunds'` | The tag for the error. |

#### Returns

`InsufficientFundsError`

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
| <a id="code-1"></a> `code` | `static` | `number` | `-32003` | The error code for InsufficientFundsError. | - |

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
