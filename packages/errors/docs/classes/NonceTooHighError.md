[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / NonceTooHighError

# Class: NonceTooHighError

Represents an error that occurs when the nonce value is too high for a transaction.

This error is typically encountered when a transaction is submitted with a nonce that is higher
than the expected next nonce for the sender's account. In Ethereum, nonces must be used in strict
sequential order to ensure transactions are processed correctly.

The error code -32003 is a standard Ethereum JSON-RPC error code indicating a transaction rejected,
which is used when a transaction is not accepted for processing due to validation failures
such as incorrect nonce values.

## Example

```ts
try {
  await client.sendTransaction({
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '0x1',
    nonce: 100 // Assuming this nonce is too high
  })
} catch (error) {
  if (error instanceof NonceTooHighError) {
    console.error('Nonce too high:', error.message);
    console.log('Try decreasing the nonce or use `await client.getTransactionCount(address)` to get the correct nonce');
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

> **new NonceTooHighError**(`message`, `args?`, `tag?`): `NonceTooHighError`

Constructs a NonceTooHighError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`NonceTooHighErrorParameters`](../interfaces/NonceTooHighErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'NonceTooHigh'`

The tag for the error.

#### Returns

`NonceTooHighError`

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

> `static` **code**: `number` = `-32003`

Error code (-32003), standard Ethereum JSON-RPC error code for transaction rejected.

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
