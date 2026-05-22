[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InternalError

# Class: InternalError

Represents an internal JSON-RPC error.

This error is typically encountered when there is an unexpected internal error on the server.
It's a catch-all for errors that don't fall into more specific categories and usually indicates
a problem with the Ethereum node or the JSON-RPC server itself, rather than with the request.

The error code -32603 is a standard JSON-RPC error code for internal errors.

## Example

```ts
try {
  await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // some method call
  })
} catch (error) {
  if (error instanceof InternalError) {
    console.error('Internal error:', error.message);
    console.log('This is likely a problem with the Ethereum node. Try again later or contact the node operator.');
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

- [`MisconfiguredClientError`](MisconfiguredClientError.md)
- [`InvalidBytesSizeError`](InvalidBytesSizeError.md)
- [`DefensiveNullCheckError`](DefensiveNullCheckError.md)
- [`UnreachableCodeError`](UnreachableCodeError.md)

## Constructors

### Constructor

> **new InternalError**(`message`, `args?`, `tag?`): `InternalError`

Constructs an InternalError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`InternalErrorParameters`](../interfaces/InternalErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'InternalError'` | The tag for the error. |

#### Returns

`InternalError`

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
| <a id="meta"></a> `meta` | `public` | `object` \| `undefined` | `undefined` | - | - |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32603` | The error code for InternalError. | - |

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
