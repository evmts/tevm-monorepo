[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / UnknownBlockError

# Class: UnknownBlockError

Represents an error that occurs when the specified block could not be found.

This error is typically encountered when a block hash or number is provided that does not correspond
to any block known to the node. This can happen if the block hasn't been mined yet, if it's on a
different chain, or if the node is not fully synced.

The error code -32001 is a non-standard extension used by some Ethereum clients to
indicate this specific condition.

## Example

```ts
try {
  const block = await client.getBlock({
    blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
  })
} catch (error) {
  if (error instanceof UnknownBlockError) {
    console.error('Unknown block:', error.message);
    console.log('The specified block does not exist or is not available to this node');
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

> **new UnknownBlockError**(`message`, `args?`, `tag?`): `UnknownBlockError`

Constructs an UnknownBlockError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message` | `string` | `undefined` | Human-readable error message. |
| `args?` | [`UnknownBlockErrorParameters`](../interfaces/UnknownBlockErrorParameters.md) | `{}` | Additional parameters for the BaseError. |
| `tag?` | `string` | `'UnknownBlock'` | The tag for the error. |

#### Returns

`UnknownBlockError`

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
| <a id="code-1"></a> `code` | `static` | `number` | `-32001` | The error code for UnknownBlockError. | - |

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
