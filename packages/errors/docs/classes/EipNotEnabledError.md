[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / EipNotEnabledError

# Class: EipNotEnabledError

Represents an error that occurs when an EIP (Ethereum Improvement Proposal) is not enabled.

EIP not enabled errors can occur due to:
- Attempting to use features or operations that require a specific EIP which is not enabled in the VM.

## Example

```typescript
import { EipNotEnabledError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { Hardfork } from '@tevm/common'

const client = createMemoryClient({ hardfork: Hardfork.London })

try {
  // Attempt an operation that requires an EIP not enabled in London
  await client.call({
    to: '0x...',
    data: '0x...',
    // Assuming this operation requires a post-London EIP
  })
} catch (error) {
  if (error instanceof EipNotEnabledError) {
    console.error('EIP not enabled:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the error, possibly by updating the client to a newer hardfork
  }
}
```

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new EipNotEnabledError**(`message?`, `args?`): `EipNotEnabledError`

Constructs an EipNotEnabledError.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'EIP not enabled error occurred.'` | Human-readable error message. |
| `args?` | [`EipNotEnabledErrorParameters`](../interfaces/EipNotEnabledErrorParameters.md) | `{}` | Additional parameters for the error. |

#### Returns

`EipNotEnabledError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | More discriminated version of name. Can be used to discriminate between errors with the same name. | [`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages) |
| <a id="name"></a> `name` | `public` | `string` | `undefined` | - | `ExecutionError.name` |
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
