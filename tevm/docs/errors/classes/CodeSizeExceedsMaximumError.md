[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / CodeSizeExceedsMaximumError

# Class: CodeSizeExceedsMaximumError

Defined in: packages/errors/types/ethereum/ethereumjs/CodeSizeExceedsMaximumError.d.ts:56

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

Defined in: packages/errors/types/ethereum/ethereumjs/CodeSizeExceedsMaximumError.d.ts:85

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

`string`

Human-readable error message.

##### args?

[`CodeSizeExceedsMaximumErrorParameters`](../type-aliases/CodeSizeExceedsMaximumErrorParameters.md)

Additional parameters for the BaseError.

##### tag?

`string`

The tag for the error.

#### Returns

`CodeSizeExceedsMaximumError`

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`message`](GasLimitExceededError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`name`](GasLimitExceededError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stack`](GasLimitExceededError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](../../evm/enumerations/EvmErrorMessage.md)

Defined in: packages/errors/types/ethereum/ethereumjs/CodeSizeExceedsMaximumError.d.ts:57

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

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stackTraceLimit`](GasLimitExceededError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:71

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.18/node\_modules/@types/node/globals.d.ts:145

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)
