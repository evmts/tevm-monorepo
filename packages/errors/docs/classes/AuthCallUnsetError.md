[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / AuthCallUnsetError

# Class: AuthCallUnsetError

Represents an EIP-3074 specific error that occurs when attempting to AUTHCALL without AUTH set.

AuthCallUnset errors can occur due to:
- Attempting to execute an AUTHCALL without setting the necessary authorization.

To debug an AuthCallUnset error:
1. **Review Authorization Logic**: Ensure that the necessary authorization is set before executing an AUTHCALL.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the AUTHCALL is attempted without AUTH set.

## Example

```typescript
import { AuthCallUnsetError } from '@tevm/errors'
try {
  // Some operation that can throw an AuthCallUnsetError
} catch (error) {
  if (error instanceof AuthCallUnsetError) {
    console.error(error.message);
    // Handle the AuthCallUnset error
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

> **new AuthCallUnsetError**(`message?`, `args?`, `tag?`): `AuthCallUnsetError`

Constructs an AuthCallUnsetError.
Represents an EIP-3074 specific error that occurs when attempting to AUTHCALL without AUTH set.

AuthCallUnset errors can occur due to:
- Attempting to execute an AUTHCALL without setting the necessary authorization.

To debug an AuthCallUnset error:
1. **Review Authorization Logic**: Ensure that the necessary authorization is set before executing an AUTHCALL.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the AUTHCALL is attempted without AUTH set.

#### Parameters

##### message?

`string` = `'AuthCallUnset error occurred.'`

Human-readable error message.

##### args?

[`AuthCallUnsetErrorParameters`](../interfaces/AuthCallUnsetErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'AuthCallUnsetError'`

The tag for the error.

#### Returns

`AuthCallUnsetError`

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

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

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
