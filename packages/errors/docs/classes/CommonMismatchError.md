[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CommonMismatchError

# Class: CommonMismatchError

Represents an error that occurs when the Common for a given block does not match the Common of the VM.

Common mismatch errors can occur due to:
- Discrepancies between the Common configurations for a block and the VM.
- Attempting to use features from a different hardfork than what's configured.

## Example

```typescript
import { CommonMismatchError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { Hardfork } from '@tevm/common'

const client = createMemoryClient({ hardfork: Hardfork.Shanghai })

try {
  await client.setChain({ hardfork: Hardfork.London })
  // This might throw a CommonMismatchError if the operation is incompatible
} catch (error) {
  if (error instanceof CommonMismatchError) {
    console.error('Common mismatch:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the common mismatch error, possibly by updating the client configuration
  }
}
```

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new CommonMismatchError**(`message?`, `args?`): `CommonMismatchError`

Constructs a CommonMismatchError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Common mismatch error occurred.'` | Human-readable error message. |
| `args?` | [`CommonMismatchErrorParameters`](../interfaces/CommonMismatchErrorParameters.md) | `{}` | Additional parameters for the error. |

#### Returns

`CommonMismatchError`

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
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32015` | The error code for ExecutionError. | [`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1) |

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
