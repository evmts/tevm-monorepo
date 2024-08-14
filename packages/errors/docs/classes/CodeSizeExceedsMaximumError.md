[**@tevm/errors**](../README.md) • **Docs**

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

### new CodeSizeExceedsMaximumError()

> **new CodeSizeExceedsMaximumError**(`message`?, `args`?, `tag`?): [`CodeSizeExceedsMaximumError`](CodeSizeExceedsMaximumError.md)

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

• **message?**: `string` = `'Code size exceeds maximum error occurred.'`

Human-readable error message.

• **args?**: [`CodeSizeExceedsMaximumErrorParameters`](../interfaces/CodeSizeExceedsMaximumErrorParameters.md) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'CodeSizeExceedsMaximumError'`

The tag for the error.

#### Returns

[`CodeSizeExceedsMaximumError`](CodeSizeExceedsMaximumError.md)

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructors)

#### Defined in

[packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js#L89)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`message`](GasLimitExceededError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`name`](GasLimitExceededError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stack`](GasLimitExceededError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `ERROR` = `EVMErrorMessage.CODESIZE_EXCEEDS_MAXIMUM`

#### Defined in

[packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeSizeExceedsMaximumError.js#L61)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`prepareStackTrace`](GasLimitExceededError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stackTraceLimit`](GasLimitExceededError.md#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:30

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Walks through the error chain.

#### Parameters

• **fn?**: `Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`walk`](GasLimitExceededError.md#walk)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L136)

***

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.2.0/node\_modules/@types/node/globals.d.ts:22

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.22/node\_modules/bun-types/globals.d.ts:1629
