[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / AccountNotFoundError

# Class: AccountNotFoundError

Represents an error that occurs when an account cannot be found in the state.

This error is typically encountered when a transaction or operation references an account that does not exist in the blockchain state.

## Example

```ts
try {
  // Some operation that can throw an AccountNotFoundError
} catch (error) {
  if (error instanceof AccountNotFoundError) {
    console.error(error.message);
    // Handle the account not found error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the ResourceNotFoundError.

## Extends

- [`ResourceNotFoundError`](ResourceNotFoundError.md)

## Constructors

### Constructor

> **new AccountNotFoundError**(`message`, `args?`, `tag?`): `AccountNotFoundError`

Constructs an AccountNotFoundError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | `AccountNotFoundErrorParameters` | `{}` | Additional parameters for the ResourceNotFoundError. |
| `tag?` | `string` | `'AccountNotFound'` | The tag for the error. |

#### Returns

`AccountNotFoundError`

#### Overrides

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`constructor`](ResourceNotFoundError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`_tag`](ResourceNotFoundError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`cause`](ResourceNotFoundError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`details`](ResourceNotFoundError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`docsPath`](ResourceNotFoundError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`metaMessages`](ResourceNotFoundError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`shortMessage`](ResourceNotFoundError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`version`](ResourceNotFoundError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32001` | The error code for ResourceNotFoundError. | [`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code-1) |

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`walk`](ResourceNotFoundError.md#walk)
