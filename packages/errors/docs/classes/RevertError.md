[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / RevertError

# Class: RevertError

Represents an error that occurs when a transaction or message call is reverted.

This error is typically encountered when a contract explicitly calls the `revert`
operation or when a condition in a `require` statement is not met. It's a way for
smart contracts to signal that an operation should be rolled back due to a failure
condition.

The error code -32000 is a standard Ethereum JSON-RPC error code indicating a
generic server error, which is often used for revert errors.

## Example

```ts
try {
  const result = await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // encoded function call that might revert
  })
} catch (error) {
  if (error instanceof RevertError) {
    console.error('Transaction reverted:', error.message);
    console.log('Revert reason:', error.data); // If available
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

- [`EvmRevertError`](EvmRevertError.md)

## Constructors

### Constructor

> **new RevertError**(`message`, `args?`, `tag?`): `RevertError`

Constructs a RevertError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`RevertErrorParameters`](../interfaces/RevertErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'Revert'` | The tag for the error. |

#### Returns

`RevertError`

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
| <a id="raw"></a> `raw` | `public` | `` `0x${string}` `` \| `undefined` | `undefined` | The raw data of the revert. | - |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `3` | The error code for RevertError. | - |

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
