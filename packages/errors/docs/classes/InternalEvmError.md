[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InternalEvmError

# Class: InternalEvmError

Represents an internal error within the EVM. This error should not typically happen
This error is typically encountered when there is an unexpected issue within the EVM execution or client.

Internal errors can occur due to:
- Bugs in the EVM implementation.
- Bugs in Tevm

If you encounter this error please open an issue on the Tevm GitHub repository.

## Example

```typescript
import { InternalEvmError } from '@tevm/errors'
try {
  // Some operation that can throw an InternalEvmError
} catch (error) {
  if (error instanceof InternalEvmError) {
    console.error(error.message);
    // Handle the internal error
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

> **new InternalEvmError**(`message?`, `args?`, `tag?`): `InternalEvmError`

Constructs an InternalEvmError.
Represents an internal error within the EVM. This error should not typically happen
This error is typically encountered when there is an unexpected issue within the EVM execution or client.

Internal errors can occur due to:
- Bugs in the EVM implementation.
- Bugs in Tevm

If you encounter this error please open an issue on the Tevm GitHub repository.

#### Parameters

##### message?

`string` = `'Internal error occurred.'`

Human-readable error message.

##### args?

[`InternalEvmErrorParameters`](../interfaces/InternalEvmErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InternalEvmError'`

The tag for the error.

#### Returns

`InternalEvmError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INTERNAL_ERROR`

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)
