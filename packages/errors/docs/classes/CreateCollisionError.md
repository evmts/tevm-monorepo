[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CreateCollisionError

# Class: CreateCollisionError

Represents an execution error that occurs when a contract creation results in a collision.

Create collision errors can occur due to:
- Attempting to deploy a contract to an address that is already in use.

To debug a create collision error:
1. **Review Deployment Logic**: Ensure that the contract address is not already in use.
2. **Nonces** Check that the nonce of the account used had been incremented. Remember nonces do not update until a block is mined.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and identify the collision.

## Example

```typescript
import { CreateCollisionError } from '@tevm/errors'
try {
  // Some operation that can throw a CreateCollisionError
} catch (error) {
  if (error instanceof CreateCollisionError) {
    console.error(error.message);
    // Handle the create collision error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### Constructor

> **new CreateCollisionError**(`message?`, `args?`, `tag?`): `CreateCollisionError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Create collision error occurred.'` | Human-readable error message. |
| `args?` | [`CreateCollisionErrorParameters`](../interfaces/CreateCollisionErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'CreateCollisionError'` | Internal error tag. |

#### Returns

`CreateCollisionError`

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
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.CREATE_COLLISION` | - | - |

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
