[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / MisconfiguredClientError

# Class: MisconfiguredClientError

Represents an error that occurs when the Client is misconfigured.

This error can be thrown when:
- Incorrect configuration parameters are provided when creating a Client.
- The Client is used in a way that's incompatible with its configuration.

## Example

```typescript
import { createMemoryClient } from '@tevm/memory-client'
import { MisconfiguredClientError } from '@tevm/errors'

const memoryClient = createMemoryClient({
  // Assume we've misconfigured something here
})

try {
  await memoryClient.tevmCall({
    to: '0x...',
    data: '0x...',
  })
} catch (error) {
  if (error instanceof MisconfiguredClientError) {
    console.error('Client misconfiguration:', error.message)
    console.log('Documentation:', error.docsLink)
    // Attempt to recreate the client with correct configuration
    // or notify the user to check their client setup
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new MisconfiguredClientError**(`message?`, `args?`): `MisconfiguredClientError`

Constructs a MisconfiguredClientError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Misconfigured client error occurred.'` | Human-readable error message. |
| `args?` | [`MisconfiguredClientErrorParameters`](../interfaces/MisconfiguredClientErrorParameters.md) | `{}` | Additional parameters for the error. |

#### Returns

`MisconfiguredClientError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`InternalError`](InternalError.md).[`cause`](InternalError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`InternalError`](InternalError.md).[`code`](InternalError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`details`](InternalError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath) |
| <a id="meta"></a> `meta` | `public` | `object` \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`meta`](InternalError.md#meta) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`InternalError`](InternalError.md).[`version`](InternalError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32603` | The error code for InternalError. | [`InternalError`](InternalError.md).[`code`](InternalError.md#code-1) |

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

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)
