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

Constructs a CreateCollisionError.
Represents an execution error that occurs when a contract creation results in a collision.

Create collision errors can occur due to:
- Attempting to deploy a contract to an address that is already in use.

To debug a create collision error:
1. **Review Deployment Logic**: Ensure that the contract address is not already in use.
2. **Nonces** Check that the nonce of the account used had been incremented. Remember nonces do not update until a block is mined.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and identify the collision.

#### Parameters

##### message?

`string` = `'Create collision error occurred.'`

Human-readable error message.

##### args?

[`CreateCollisionErrorParameters`](../interfaces/CreateCollisionErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'CreateCollisionError'`

The tag for the error.

#### Returns

`CreateCollisionError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

***

### code

> `static` **code**: `number` = `-32015`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.CREATE_COLLISION`

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)
