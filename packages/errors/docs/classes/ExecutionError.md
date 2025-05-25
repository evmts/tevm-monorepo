[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ExecutionError

# Class: ExecutionError

Defined in: packages/errors/src/ethereum/ExecutionErrorError.js:41

Represents an error that occurs when an execution error happens on the Ethereum node.

This error is typically encountered when there is a general execution error that does not fit more specific categories.

## Example

```ts
try {
  // Some operation that can throw an ExecutionError
} catch (error) {
  if (error instanceof ExecutionError) {
    console.error(error.message);
    // Handle the execution error
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

- [`CommonMismatchError`](CommonMismatchError.md)
- [`EipNotEnabledError`](EipNotEnabledError.md)
- [`InvalidOpcodeError`](InvalidOpcodeError.md)
- [`StopError`](StopError.md)
- [`OutOfRangeError`](OutOfRangeError.md)
- [`InvalidJumpError`](InvalidJumpError.md)
- [`InvalidProofError`](InvalidProofError.md)
- [`AuthCallUnsetError`](AuthCallUnsetError.md)
- [`StackOverflowError`](StackOverflowError.md)
- [`InvalidJumpSubError`](InvalidJumpSubError.md)
- [`StackUnderflowError`](StackUnderflowError.md)
- [`CreateCollisionError`](CreateCollisionError.md)
- [`InvalidBeginSubError`](InvalidBeginSubError.md)
- [`RefundExhaustedError`](RefundExhaustedError.md)
- [`InvalidEofFormatError`](InvalidEofFormatError.md)
- [`InvalidKzgInputsError`](InvalidKzgInputsError.md)
- [`InvalidReturnSubError`](InvalidReturnSubError.md)
- [`InvalidCommitmentError`](InvalidCommitmentError.md)
- [`StaticStateChangeError`](StaticStateChangeError.md)
- [`BLS12381InputEmptyError`](BLS12381InputEmptyError.md)
- [`InvalidInputLengthError`](InvalidInputLengthError.md)
- [`InsufficientBalanceError`](InsufficientBalanceError.md)
- [`BLS12381FpNotInFieldError`](BLS12381FpNotInFieldError.md)
- [`InitcodeSizeViolationError`](InitcodeSizeViolationError.md)
- [`InvalidBytecodeResultError`](InvalidBytecodeResultError.md)
- [`BLS12381PointNotOnCurveError`](BLS12381PointNotOnCurveError.md)
- [`BLS12381InvalidInputLengthError`](BLS12381InvalidInputLengthError.md)
- [`ValueOverflowError`](ValueOverflowError.md)

## Constructors

### Constructor

> **new ExecutionError**(`message`, `args?`, `tag?`): `ExecutionError`

Defined in: packages/errors/src/ethereum/ExecutionErrorError.js:55

Constructs an ExecutionError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ExecutionErrorParameters`](../interfaces/ExecutionErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ExecutionError'`

Internal name/tag for the error.

#### Returns

`ExecutionError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:82

More discriminated version of name. Can be used to discriminate between errors with the same name.

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/src/ethereum/BaseError.js:114

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/src/ethereum/BaseError.js:112

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:91

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/src/ethereum/BaseError.js:96

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/src/ethereum/BaseError.js:100

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:104

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:108

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

***

### code

> `static` **code**: `number` = `-32000`

Defined in: packages/errors/src/ethereum/ExecutionErrorError.js:46

Error code, analogous to the code in JSON RPC error.

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:960

The maximum number of stack frames to capture.

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Defined in: packages/errors/src/ethereum/BaseError.js:137

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

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:955

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:145

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

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

***

### isError()

> `static` **isError**(`value`): `value is Error`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:950

Check if a value is an instance of Error

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

#### Inherited from

[`BaseError`](BaseError.md).[`isError`](BaseError.md#iserror)

***

### prepareStackTrace()

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:149

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

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)
