[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / ExecutionError

# Class: ExecutionError

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
- [`CommonMismatchError`](CommonMismatchError.md)
- [`EipNotEnabledError`](EipNotEnabledError.md)

## Constructors

### new ExecutionError()

> **new ExecutionError**(`message`, `args`?, `tag`?): [`ExecutionError`](ExecutionError.md)

Constructs an ExecutionError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`ExecutionErrorParameters`](../type-aliases/ExecutionErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

Internal name/tag for the error.

#### Returns

[`ExecutionError`](ExecutionError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ExecutionErrorError.d.ts:50

## Properties

### \_tag

> **\_tag**: `string`

More discriminated version of name. Can be used to discriminate between errors with the same name.

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:40

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

***

### code

> `static` **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Defined in

packages/errors/types/ethereum/ExecutionErrorError.d.ts:42

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:71

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
