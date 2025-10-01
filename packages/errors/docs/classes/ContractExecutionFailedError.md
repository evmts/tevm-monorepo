[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ContractExecutionFailedError

# Class: ContractExecutionFailedError

Represents an error that occurs when the execution of a smart contract fails.

This error is typically encountered when a smart contract's execution reverts or
encounters an exception during its operation. It can be due to various reasons such as
failing assertions, out-of-gas errors, or other contract-specific logic failures.

The error code -32015 is a non-standard extension used by some Ethereum clients to
indicate a contract execution failure.

## Example

```ts
try {
  const result = await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // encoded function call
  })
} catch (error) {
  if (error instanceof ContractExecutionFailedError) {
    console.error('Contract execution failed:', error.message);
    console.log('Check the contract logic or input parameters');
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

> **new ContractExecutionFailedError**(`message`, `args?`, `tag?`): `ContractExecutionFailedError`

Constructs a ContractExecutionFailedError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ContractExecutionFailedErrorParameters`](../interfaces/ContractExecutionFailedErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ContractExecutionFailed'`

The tag for the error.

#### Returns

`ContractExecutionFailedError`

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

> `static` **code**: `number` = `-32015`

Error code (-32015), a convention for EVM execution errors.

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
