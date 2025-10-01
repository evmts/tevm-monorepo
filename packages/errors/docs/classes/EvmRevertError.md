[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / EvmRevertError

# Class: EvmRevertError

Represents an execution error that occurs when a transaction is reverted during EVM execution.
This error is typically encountered when a smart contract execution is reverted due to unmet conditions or failed assertions.

EvmRevert errors can occur due to:
- Failed assertions in the smart contract code.
- Conditions in the code that trigger a revert.
- Insufficient gas to complete the transaction.
- Contract logic that intentionally reverts under certain conditions.

To debug a revert error:
1. **Review Revert Conditions**: Ensure that the conditions in the contract code that trigger reverts are properly handled and expected.
2. **Check Assertions**: Verify that all assertions in the code are valid and necessary.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the revert occurs.
4. **Inspect Contract Logic**: Manually inspect the contract code to understand why the revert is being triggered and ensure it is intentional.

## Example

```typescript
import { EvmRevertError } from '@tevm/errors'
try {
  // Some operation that can throw a EvmRevertError
} catch (error) {
  if (error instanceof EvmRevertError) {
    console.error(error.message);
    // Handle the revert error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`RevertError`](RevertError.md)

## Constructors

### Constructor

> **new EvmRevertError**(`message?`, `args?`, `tag?`): `EvmRevertError`

Constructs a EvmRevertError.
Represents an execution error that occurs when a transaction is reverted during EVM execution.
This error is typically encountered when a smart contract execution is reverted due to unmet conditions or failed assertions.

EvmRevert errors can occur due to:
- Failed assertions in the smart contract code.
- Conditions in the code that trigger a revert.
- Insufficient gas to complete the transaction.
- Contract logic that intentionally reverts under certain conditions.

To debug a revert error:
1. **Review Revert Conditions**: Ensure that the conditions in the contract code that trigger reverts are properly handled and expected.
2. **Check Assertions**: Verify that all assertions in the code are valid and necessary.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the revert occurs.
4. **Inspect Contract Logic**: Manually inspect the contract code to understand why the revert is being triggered and ensure it is intentional.

#### Parameters

##### message?

`string` = `'Revert error occurred.'`

Human-readable error message.

##### args?

[`EvmRevertErrorParameters`](../interfaces/EvmRevertErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'EvmRevertError'`

The tag for the error.

#### Returns

`EvmRevertError`

#### Overrides

[`RevertError`](RevertError.md).[`constructor`](RevertError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`RevertError`](RevertError.md).[`_tag`](RevertError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`RevertError`](RevertError.md).[`cause`](RevertError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`RevertError`](RevertError.md).[`code`](RevertError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`details`](RevertError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`RevertError`](RevertError.md).[`docsPath`](RevertError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`RevertError`](RevertError.md).[`metaMessages`](RevertError.md#metamessages)

***

### raw

> **raw**: `undefined` \| `` `0x${string}` ``

The raw data of the revert.

#### Inherited from

[`RevertError`](RevertError.md).[`raw`](RevertError.md#raw)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`shortMessage`](RevertError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`version`](RevertError.md#version)

***

### code

> `static` **code**: `number` = `3`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`RevertError`](RevertError.md).[`code`](RevertError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.REVERT`

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

[`RevertError`](RevertError.md).[`walk`](RevertError.md#walk)
