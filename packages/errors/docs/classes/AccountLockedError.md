[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / AccountLockedError

# Class: AccountLockedError

Represents an error that occurs when an account is locked.

This error is typically encountered when an operation is attempted on an account
that has been locked for security reasons. This might happen if the account has
been temporarily disabled, if additional authentication is required, or if the
account's private key is not available to the node.

The error code -32005 is a non-standard extension used by some Ethereum clients to
indicate this specific condition.

## Example

```ts
try {
  await client.sendTransaction({
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '0x1'
  })
} catch (error) {
  if (error instanceof AccountLockedError) {
    console.error('Account locked:', error.message);
    console.log('Unlock the account or use a different account for this transaction');
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

> **new AccountLockedError**(`message`, `args?`, `tag?`): `AccountLockedError`

Constructs an AccountLockedError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`AccountLockedErrorParameters`](../interfaces/AccountLockedErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'AccountLocked'`

The tag for the error.

#### Returns

`AccountLockedError`

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

### code

> `static` **code**: `number` = `-32020`

Error code (-32020), a non-standard extension for this specific error.

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
