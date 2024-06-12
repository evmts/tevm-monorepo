---
editUrl: false
next: false
prev: false
title: "InvalidToError"
---

Represents an error that occurs when the 'to' parameter is invalid.

This error is typically encountered when a transaction or operation references a 'to' parameter that is invalid or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidToError
} catch (error) {
  if (error instanceof InvalidToError) {
    console.error(error.message);
    // Handle the invalid 'to' error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidToError.

## Extends

- [`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/)

## Constructors

### new InvalidToError()

> **new InvalidToError**(`message`, `args`?): [`InvalidToError`](/reference/tevm/errors/classes/invalidtoerror/)

Constructs an InvalidToError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidToErrorParameters`](/reference/tevm/errors/interfaces/invalidtoerrorparameters/)= `{}`

Additional parameters for the InvalidToError.

#### Returns

[`InvalidToError`](/reference/tevm/errors/classes/invalidtoerror/)

#### Overrides

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`constructor`](/reference/tevm/errors/classes/invalidparamserror/#constructors)

#### Source

[packages/errors/src/input/InvalidToError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidToError.js#L47)

## Properties

### \_tag

> **\_tag**: `"InvalidParams"` = `'InvalidParams'`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`_tag`](/reference/tevm/errors/classes/invalidparamserror/#_tag)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`cause`](/reference/tevm/errors/classes/invalidparamserror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`code`](/reference/tevm/errors/classes/invalidparamserror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`details`](/reference/tevm/errors/classes/invalidparamserror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`docsPath`](/reference/tevm/errors/classes/invalidparamserror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`message`](/reference/tevm/errors/classes/invalidparamserror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`meta`](/reference/tevm/errors/classes/invalidparamserror/#meta)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`metaMessages`](/reference/tevm/errors/classes/invalidparamserror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `"InvalidParams"` = `'InvalidParams'`

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`name`](/reference/tevm/errors/classes/invalidparamserror/#name)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`shortMessage`](/reference/tevm/errors/classes/invalidparamserror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stack`](/reference/tevm/errors/classes/invalidparamserror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`version`](/reference/tevm/errors/classes/invalidparamserror/#version)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`prepareStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stackTraceLimit`](/reference/tevm/errors/classes/invalidparamserror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:30

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`walk`](/reference/tevm/errors/classes/invalidparamserror/#walk)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
