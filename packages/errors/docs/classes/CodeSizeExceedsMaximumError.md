[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CodeSizeExceedsMaximumError

# Class: CodeSizeExceedsMaximumError

Defined in: [packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js#L60)

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

### new CodeSizeExceedsMaximumError()

> **new CodeSizeExceedsMaximumError**(`message`?, `args`?, `tag`?): `CodeSizeExceedsMaximumError`

Defined in: [packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js#L89)

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

Defined in: [packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: [packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause)

***

### code

> **code**: `number`

Defined in: [packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code)

***

### details

> **details**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`message`](GasLimitExceededError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: [packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`name`](GasLimitExceededError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stack`](GasLimitExceededError.md#stack)

***

### version

> **version**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `ERROR` = `EVMErrorMessage.CODESIZE_EXCEEDS_MAXIMUM`

Defined in: [packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js#L61)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`prepareStackTrace`](GasLimitExceededError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stackTraceLimit`](GasLimitExceededError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Defined in: [packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

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

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.11/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.5/node\_modules/bun-types/globals.d.ts:1441

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)
