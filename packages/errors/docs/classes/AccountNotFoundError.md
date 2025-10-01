[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / AccountNotFoundError

# Class: AccountNotFoundError

Represents an error that occurs when an account cannot be found in the state.

This error is typically encountered when a transaction or operation references an account that does not exist in the blockchain state.

## Example

```ts
try {
  // Some operation that can throw an AccountNotFoundError
} catch (error) {
  if (error instanceof AccountNotFoundError) {
    console.error(error.message);
    // Handle the account not found error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the ResourceNotFoundError.

## Extends

- [`ResourceNotFoundError`](ResourceNotFoundError.md)

## Constructors

### Constructor

> **new AccountNotFoundError**(`message`, `args?`, `tag?`): `AccountNotFoundError`

Constructs an AccountNotFoundError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

`AccountNotFoundErrorParameters` = `{}`

Additional parameters for the ResourceNotFoundError.

##### tag?

`string` = `'AccountNotFound'`

The tag for the error.

#### Returns

`AccountNotFoundError`

#### Overrides

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`constructor`](ResourceNotFoundError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`_tag`](ResourceNotFoundError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`cause`](ResourceNotFoundError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`details`](ResourceNotFoundError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`docsPath`](ResourceNotFoundError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`metaMessages`](ResourceNotFoundError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`shortMessage`](ResourceNotFoundError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`version`](ResourceNotFoundError.md#version)

***

### code

> `static` **code**: `number` = `-32001`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code-1)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`walk`](ResourceNotFoundError.md#walk)
