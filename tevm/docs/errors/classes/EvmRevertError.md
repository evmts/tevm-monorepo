[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / EvmRevertError

# Class: EvmRevertError

Defined in: packages/errors/types/ethereum/ethereumjs/EvmRevertError.d.ts:51

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

Defined in: packages/errors/types/ethereum/ethereumjs/EvmRevertError.d.ts:74

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

`string`

Human-readable error message.

##### args?

[`EvmRevertErrorParameters`](../type-aliases/EvmRevertErrorParameters.md)

Additional parameters for the BaseError.

##### tag?

`string`

The tag for the error.

#### Returns

`EvmRevertError`

#### Overrides

[`RevertError`](RevertError.md).[`constructor`](RevertError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

[`RevertError`](RevertError.md).[`_tag`](RevertError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`RevertError`](RevertError.md).[`cause`](RevertError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

#### Inherited from

[`RevertError`](RevertError.md).[`code`](RevertError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`RevertError`](RevertError.md).[`details`](RevertError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

[`RevertError`](RevertError.md).[`docsPath`](RevertError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`RevertError`](RevertError.md).[`message`](RevertError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

[`RevertError`](RevertError.md).[`metaMessages`](RevertError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`RevertError`](RevertError.md).[`name`](RevertError.md#name)

***

### raw

> **raw**: `undefined` \| `` `0x${string}` ``

Defined in: packages/errors/types/ethereum/RevertError.d.ts:62

The raw data of the revert.

#### Inherited from

[`RevertError`](RevertError.md).[`raw`](RevertError.md#raw)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`RevertError`](RevertError.md).[`shortMessage`](RevertError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`RevertError`](RevertError.md).[`stack`](RevertError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`RevertError`](RevertError.md).[`version`](RevertError.md#version)

***

### code

> `static` **code**: `number`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:53

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`RevertError`](RevertError.md).[`code`](RevertError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string`

Defined in: packages/errors/types/ethereum/ethereumjs/EvmRevertError.d.ts:52

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.18.8/node\_modules/@types/node/globals.d.ts:68

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

#### Inherited from

[`RevertError`](RevertError.md).[`stackTraceLimit`](RevertError.md#stacktracelimit)

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

[`RevertError`](RevertError.md).[`walk`](RevertError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.18.8/node\_modules/@types/node/globals.d.ts:52

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

[`RevertError`](RevertError.md).[`captureStackTrace`](RevertError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@24.6.0/node\_modules/@types/node/globals.d.ts:52

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

[`RevertError`](RevertError.md).[`captureStackTrace`](RevertError.md#capturestacktrace)

***

### isError()

> `static` **isError**(`error`): `error is Error`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

##### error

`unknown`

#### Returns

`error is Error`

#### Inherited from

[`RevertError`](RevertError.md).[`isError`](RevertError.md#iserror)

***

### prepareStackTrace()

#### Call Signature

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

Defined in: node\_modules/.pnpm/@types+node@22.18.8/node\_modules/@types/node/globals.d.ts:56

##### Parameters

###### err

`Error`

###### stackTraces

`CallSite`[]

##### Returns

`any`

##### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Inherited from

[`RevertError`](RevertError.md).[`prepareStackTrace`](RevertError.md#preparestacktrace)

#### Call Signature

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

Defined in: node\_modules/.pnpm/@types+node@24.6.0/node\_modules/@types/node/globals.d.ts:56

##### Parameters

###### err

`Error`

###### stackTraces

`CallSite`[]

##### Returns

`any`

##### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Inherited from

[`RevertError`](RevertError.md).[`prepareStackTrace`](RevertError.md#preparestacktrace)
