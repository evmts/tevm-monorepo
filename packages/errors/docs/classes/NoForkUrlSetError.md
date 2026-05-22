[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / NoForkUrlSetError

# Class: NoForkUrlSetError

Error represents the tevm client attempted to fetch a resource from a Forked transport but no fork url was set in the transport.

## Example

```javascript
import { NoForkUrlSetError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient() // No fork configuration

try {
  await client.getBalance('0x...') // This might throw if it needs to access forked state
} catch (error) {
  if (error instanceof NoForkUrlSetError) {
    console.error('No fork url set:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the error, e.g., by setting up a fork configuration
  }
}
```

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new NoForkUrlSetError**(`message`, `args?`): `NoForkUrlSetError`

Constructs a NoForkUrlSetError.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | Human-readable error message. |
| `args?` | [`NoForkUrlSetErrorParameters`](../interfaces/NoForkUrlSetErrorParameters.md) | Additional parameters for the error. |

#### Returns

`NoForkUrlSetError`

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
