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

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Revert error occurred.'` | Human-readable error message. |
| `args?` | [`EvmRevertErrorParameters`](../interfaces/EvmRevertErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'EvmRevertError'` | Internal error tag. |

#### Returns

`EvmRevertError`

#### Overrides

[`RevertError`](RevertError.md).[`constructor`](RevertError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`RevertError`](RevertError.md).[`_tag`](RevertError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`RevertError`](RevertError.md).[`cause`](RevertError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`RevertError`](RevertError.md).[`code`](RevertError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`RevertError`](RevertError.md).[`details`](RevertError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`RevertError`](RevertError.md).[`docsPath`](RevertError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`RevertError`](RevertError.md).[`metaMessages`](RevertError.md#metamessages) |
| <a id="raw"></a> `raw` | `public` | `` `0x${string}` `` \| `undefined` | `undefined` | The raw data of the revert. | [`RevertError`](RevertError.md).[`raw`](RevertError.md#raw) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`RevertError`](RevertError.md).[`shortMessage`](RevertError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`RevertError`](RevertError.md).[`version`](RevertError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `3` | The error code for RevertError. | [`RevertError`](RevertError.md).[`code`](RevertError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.REVERT` | - | - |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`RevertError`](RevertError.md).[`walk`](RevertError.md#walk)
