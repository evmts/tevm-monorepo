[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BlockGasLimitExceededError

# Class: BlockGasLimitExceededError

Represents an error that occurs when the block gas limit has been exceeded.

This error is typically encountered when a transaction or set of transactions in a block
consume more gas than the block's gas limit allows. Each block in Ethereum has a maximum
amount of gas that can be used by all transactions within it.

The error code -32006 is a non-standard extension used by some Ethereum clients to
indicate this specific condition.

## Example

```ts
try {
  const result = await client.sendTransaction({
    // ... transaction details
  })
} catch (error) {
  if (error instanceof BlockGasLimitExceededError) {
    console.error('Block gas limit exceeded:', error.message);
    console.log('Consider splitting the transaction or waiting for a block with more available gas');
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

> **new BlockGasLimitExceededError**(`message`, `args?`, `tag?`): `BlockGasLimitExceededError`

Constructs a BlockGasLimitExceededError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`BlockGasLimitExceededErrorParameters`](../interfaces/BlockGasLimitExceededErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'BlockGasLimitExceeded'`

The tag for the error.

#### Returns

`BlockGasLimitExceededError`

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

> `static` **code**: `number` = `-32006`

Error code (-32006), a non-standard extension for this specific error.

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
