[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / RevertError

# Class: RevertError

Represents an error that occurs when a transaction or message call is reverted.

This error is typically encountered when a contract explicitly calls the `revert`
operation or when a condition in a `require` statement is not met. It's a way for
smart contracts to signal that an operation should be rolled back due to a failure
condition.

The error code -32000 is a standard Ethereum JSON-RPC error code indicating a
generic server error, which is often used for revert errors.

## Example

```ts
try {
  const result = await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // encoded function call that might revert
  })
} catch (error) {
  if (error instanceof RevertError) {
    console.error('Transaction reverted:', error.message);
    console.log('Revert reason:', error.data); // If available
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

- [`EvmRevertError`](EvmRevertError.md)

## Constructors

### Constructor

> **new RevertError**(`message`, `args?`, `tag?`): `RevertError`

Constructs a RevertError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`RevertErrorParameters`](../interfaces/RevertErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'Revert'`

The tag for the error.

#### Returns

`RevertError`

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

### raw

> **raw**: `undefined` \| `` `0x${string}` ``

The raw data of the revert.

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

> `static` **code**: `number` = `3`

Error code (-32000), standard Ethereum JSON-RPC error code for server errors.

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
