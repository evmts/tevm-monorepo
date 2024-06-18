---
editUrl: false
next: false
prev: false
title: "ExecutionError"
---

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

- [`BaseError`](/reference/tevm/errors/classes/baseerror/)

## Extended by

- [`InvalidOpcodeError`](/reference/tevm/errors/classes/invalidopcodeerror/)
- [`StopError`](/reference/tevm/errors/classes/stoperror/)
- [`OutOfRangeError`](/reference/tevm/errors/classes/outofrangeerror/)
- [`InvalidJumpError`](/reference/tevm/errors/classes/invalidjumperror/)
- [`AuthInvalidSError`](/reference/tevm/errors/classes/authinvalidserror/)
- [`InvalidProofError`](/reference/tevm/errors/classes/invalidprooferror/)
- [`AuthCallUnsetError`](/reference/tevm/errors/classes/authcallunseterror/)
- [`StackOverflowError`](/reference/tevm/errors/classes/stackoverflowerror/)
- [`InvalidJumpSubError`](/reference/tevm/errors/classes/invalidjumpsuberror/)
- [`StackUnderflowError`](/reference/tevm/errors/classes/stackunderflowerror/)
- [`CreateCollisionError`](/reference/tevm/errors/classes/createcollisionerror/)
- [`InvalidBeginSubError`](/reference/tevm/errors/classes/invalidbeginsuberror/)
- [`RefundExhaustedError`](/reference/tevm/errors/classes/refundexhaustederror/)
- [`InvalidEofFormatError`](/reference/tevm/errors/classes/invalideofformaterror/)
- [`InvalidKzgInputsError`](/reference/tevm/errors/classes/invalidkzginputserror/)
- [`InvalidReturnSubError`](/reference/tevm/errors/classes/invalidreturnsuberror/)
- [`InvalidCommitmentError`](/reference/tevm/errors/classes/invalidcommitmenterror/)
- [`StaticStateChangeError`](/reference/tevm/errors/classes/staticstatechangeerror/)
- [`BLS12381InputEmptyError`](/reference/tevm/errors/classes/bls12381inputemptyerror/)
- [`InvalidInputLengthError`](/reference/tevm/errors/classes/invalidinputlengtherror/)
- [`InsufficientBalanceError`](/reference/tevm/errors/classes/insufficientbalanceerror/)
- [`BLS12381FpNotInFieldError`](/reference/tevm/errors/classes/bls12381fpnotinfielderror/)
- [`InitcodeSizeViolationError`](/reference/tevm/errors/classes/initcodesizeviolationerror/)
- [`InvalidBytecodeResultError`](/reference/tevm/errors/classes/invalidbytecoderesulterror/)
- [`AuthCallNonZeroValueExtError`](/reference/tevm/errors/classes/authcallnonzerovalueexterror/)
- [`BLS12381PointNotOnCurveError`](/reference/tevm/errors/classes/bls12381pointnotoncurveerror/)
- [`BLS12381InvalidInputLengthError`](/reference/tevm/errors/classes/bls12381invalidinputlengtherror/)
- [`ValueOverflowError`](/reference/tevm/errors/classes/valueoverflowerror/)
- [`CommonMismatchError`](/reference/tevm/errors/classes/commonmismatcherror/)
- [`EipNotEnabledError`](/reference/tevm/errors/classes/eipnotenablederror/)

## Constructors

### new ExecutionError()

> **new ExecutionError**(`message`, `args`?): [`ExecutionError`](/reference/tevm/errors/classes/executionerror/)

Constructs an ExecutionError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`ExecutionErrorParameters`](/reference/tevm/errors/interfaces/executionerrorparameters/)= `{}`

Additional parameters for the BaseError.

#### Returns

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/)

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`constructor`](/reference/tevm/errors/classes/baseerror/#constructors)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L48)

## Properties

### \_tag

> **\_tag**: `string` = `'ExecutionError'`

More discriminated version of name. Can be used to discriminate between errors with the same name.

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`_tag`](/reference/tevm/errors/classes/baseerror/#_tag)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L76)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`cause`](/reference/tevm/errors/classes/baseerror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`code`](/reference/tevm/errors/classes/baseerror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`details`](/reference/tevm/errors/classes/baseerror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`docsPath`](/reference/tevm/errors/classes/baseerror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`message`](/reference/tevm/errors/classes/baseerror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L69)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`metaMessages`](/reference/tevm/errors/classes/baseerror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `"ExecutionError"` = `'ExecutionError'`

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`name`](/reference/tevm/errors/classes/baseerror/#name)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L82)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`shortMessage`](/reference/tevm/errors/classes/baseerror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stack`](/reference/tevm/errors/classes/baseerror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`version`](/reference/tevm/errors/classes/baseerror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/baseerror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/baseerror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:30

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`walk`](/reference/tevm/errors/classes/baseerror/#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.13/node\_modules/bun-types/globals.d.ts:1613
