---
editUrl: false
next: false
prev: false
title: "DefensiveNullCheckError"
---

Represents an error that occurs when a defensive null check is tripped.
This error should never be thrown and indicates a bug in the Tevm VM if it is thrown.

## Example

```javascript
import { DefensiveNullCheckError } from '@tevm/errors'

function assertNotNull(value, message) {
  if (value === null || value === undefined) {
    throw new DefensiveNullCheckError(message)
  }
  return value
}

try {
  const result = someFunction()
  assertNotNull(result, 'Result should not be null')
} catch (error) {
  if (error instanceof DefensiveNullCheckError) {
    console.error('Unexpected null value:', error.message)
    // This indicates a bug in the Tevm VM
    reportBugToTevmRepository(error)
  }
}
```

## Extends

- [`InternalError`](/reference/tevm/errors/classes/internalerror/)

## Constructors

### new DefensiveNullCheckError()

> **new DefensiveNullCheckError**(`message`?, `args`?): [`DefensiveNullCheckError`](/reference/tevm/errors/classes/defensivenullcheckerror/)

Constructs a DefensiveNullCheckError.

#### Parameters

• **message?**: `string`

Human-readable error message.

• **args?**: [`DefensiveNullCheckErrorParameters`](/reference/tevm/errors/interfaces/defensivenullcheckerrorparameters/) = `{}`

Additional parameters for the error.

#### Returns

[`DefensiveNullCheckError`](/reference/tevm/errors/classes/defensivenullcheckerror/)

#### Overrides

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`constructor`](/reference/tevm/errors/classes/internalerror/#constructors)

#### Defined in

[packages/errors/src/defensive/DefensiveNullCheckError.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/DefensiveNullCheckError.js#L51)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`_tag`](/reference/tevm/errors/classes/internalerror/#_tag)

#### Defined in

[packages/errors/src/defensive/DefensiveNullCheckError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/DefensiveNullCheckError.js#L63)

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`cause`](/reference/tevm/errors/classes/internalerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`code`](/reference/tevm/errors/classes/internalerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`details`](/reference/tevm/errors/classes/internalerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`docsPath`](/reference/tevm/errors/classes/internalerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`message`](/reference/tevm/errors/classes/internalerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`meta`](/reference/tevm/errors/classes/internalerror/#meta)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L75)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`metaMessages`](/reference/tevm/errors/classes/internalerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`name`](/reference/tevm/errors/classes/internalerror/#name)

#### Defined in

[packages/errors/src/defensive/DefensiveNullCheckError.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/DefensiveNullCheckError.js#L62)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`shortMessage`](/reference/tevm/errors/classes/internalerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stack`](/reference/tevm/errors/classes/internalerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`version`](/reference/tevm/errors/classes/internalerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### code

> `static` **code**: `number` = `-32603`

The error code for InternalError.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`code`](/reference/tevm/errors/classes/internalerror/#code-1)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L52)

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/internalerror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/internalerror/#stacktracelimit)

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`walk`](/reference/tevm/errors/classes/internalerror/#walk)

#### Defined in

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
