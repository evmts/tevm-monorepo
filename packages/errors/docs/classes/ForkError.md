[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ForkError

# Class: ForkError

Represents an error thrown when attempting to fetch a resource from a Forked transport.
If the underlying JSON-RPC call has an error code, the error code will be proxied to the ForkError.

## Example

```javascript
import { ForkError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'

const client = createMemoryClient({
  fork: {
    url: 'https://mainnet.example.com'
  }
})

try {
  await client.getBalance('0x...')
} catch (error) {
  if (error instanceof ForkError) {
    console.error('Fork error:', error.message)
    console.log('Error code:', error.code)
    console.log('Documentation:', error.docsLink)
    // Handle the fork error, e.g., by retrying or using a different RPC endpoint
  }
}
```

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new ForkError**(`message`, `args`): `ForkError`

Constructs a ForkError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | Human-readable error message. |
| `args` | [`ForkErrorParameters`](../interfaces/ForkErrorParameters.md) | Additional parameters for the error. |

#### Returns

`ForkError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `string` | [`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag) |
| <a id="cause"></a> `cause` | `any` | [`BaseError`](BaseError.md).[`cause`](BaseError.md#cause) |
| <a id="code"></a> `code` | `number` | [`BaseError`](BaseError.md).[`code`](BaseError.md#code) |
| <a id="details"></a> `details` | `string` | [`BaseError`](BaseError.md).[`details`](BaseError.md#details) |
| <a id="docspath"></a> `docsPath` | `string` \| `undefined` | [`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `string`[] \| `undefined` | [`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages) |
| <a id="name"></a> `name` | `string` | `BaseError.name` |
| <a id="shortmessage"></a> `shortMessage` | `string` | [`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage) |
| <a id="version"></a> `version` | `string` | [`BaseError`](BaseError.md).[`version`](BaseError.md#version) |

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
