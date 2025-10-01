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

Constructs a CodeSizeExceedsMaximumError.
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

#### Parameters

##### message?

`string` = `'Code size exceeds maximum error occurred.'`

Human-readable error message.

##### args?

[`CodeSizeExceedsMaximumErrorParameters`](../interfaces/CodeSizeExceedsMaximumErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'CodeSizeExceedsMaximumError'`

The tag for the error.

#### Returns

`CodeSizeExceedsMaximumError`

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version)

***

### code

> `static` **code**: `number` = `-32003`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM`

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

[`GasLimitExceededError`](GasLimitExceededError.md).[`walk`](GasLimitExceededError.md#walk)
