[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CodeSizeExceedsMaximumError

# Class: CodeSizeExceedsMaximumError

Represents an calldata/creation error that occurs when the code size exceeds the maximum limit.
This error is typically encountered when the contract size to be deployed exceeds the maximum allowed size.

Code size exceeds maximum errors can occur due to:
- Deployment of contracts with large bytecode.
- Contracts with a significant amount of embedded data or logic.
- Incorrect settings for contract size limits in TEVM configuration.

To debug a code size exceeds maximum error:
1. **Review Contract Size**: Ensure that the contract bytecode size is within the allowed limits. Consider refactoring the contract to reduce its size.
2. **Optimize Contract Code**: Break down large contracts into smaller, modular contracts and use libraries or inheritance to share code.
3. **Configure TEVM Memory Client**: When creating a TEVM MemoryClient instance, set `allowUnlimitedContractSize` to `true` if necessary. Note that even with this setting, you may still encounter block limits.
   ```typescript
   import { createMemoryClient } from 'tevm'

   const client = createMemoryClient({ allowUnlimitedContractSize: true })
   ```
4. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment process and inspect the bytecode size.
5. **Use Other Tools**: Use other tools to analyze and optimize contract bytecode.

## Example

```typescript
import { CodeSizeExceedsMaximumError } from '@tevm/errors'
try {
  // Some operation that can throw a CodeSizeExceedsMaximumError
} catch (error) {
  if (error instanceof CodeSizeExceedsMaximumError) {
    console.error(error.message);
    // Handle the code size exceeds maximum error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`GasLimitExceededError`](GasLimitExceededError.md)

## Constructors

### Constructor

> **new CodeSizeExceedsMaximumError**(`message?`, `args?`, `tag?`): `CodeSizeExceedsMaximumError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Code size exceeds maximum error occurred.'` | Human-readable error message. |
| `args?` | [`CodeSizeExceedsMaximumErrorParameters`](../interfaces/CodeSizeExceedsMaximumErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'CodeSizeExceedsMaximumError'` | Internal error tag. |

#### Returns

`CodeSizeExceedsMaximumError`

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32003` | The error code for GasLimitExceededError. | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM` | - | - |

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

[`GasLimitExceededError`](GasLimitExceededError.md).[`walk`](GasLimitExceededError.md#walk)
