[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InternalError

# Class: InternalError

Represents an internal JSON-RPC error.

This error is typically encountered when there is an unexpected internal error on the server.
It's a catch-all for errors that don't fall into more specific categories and usually indicates
a problem with the Ethereum node or the JSON-RPC server itself, rather than with the request.

The error code -32603 is a standard JSON-RPC error code for internal errors.

## Example

```ts
try {
  await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // some method call
  })
} catch (error) {
  if (error instanceof InternalError) {
    console.error('Internal error:', error.message);
    console.log('This is likely a problem with the Ethereum node. Try again later or contact the node operator.');
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Extended by

- [`MisconfiguredClientError`](MisconfiguredClientError.md)
- [`InvalidBytesSizeError`](InvalidBytesSizeError.md)
- [`DefensiveNullCheckError`](DefensiveNullCheckError.md)
- [`UnreachableCodeError`](UnreachableCodeError.md)

## Constructors

### Constructor

> **new InternalError**(`message`, `args?`, `tag?`): `InternalError`

Constructs an InternalError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InternalErrorParameters`](../interfaces/InternalErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InternalError'`

The tag for the error.

#### Returns

`InternalError`

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

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

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

> `static` **code**: `number` = `-32603`

Error code (-32603), standard JSON-RPC error code for internal errors.

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
