---
editUrl: false
next: false
prev: false
title: "UnexpectedInternalServerError"
---

Error that is thrown when something unexpected happens
THis error being thrown indicates a bug or unhandled error
internally in tevm and thus shouldn't happen often

## Extends

- `Error`

## Constructors

### new UnexpectedInternalServerError(method)

> **new UnexpectedInternalServerError**(`method`): [`UnexpectedInternalServerError`](/reference/tevm/errors/classes/unexpectedinternalservererror/)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

[packages/errors/src/client/UnexpectedInternalServerError.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnexpectedInternalServerError.js#L19)

## Properties

### \_tag

> **\_tag**: `"UnexpectedInternalServerError"` = `'UnexpectedInternalServerError'`

#### Source

[packages/errors/src/client/UnexpectedInternalServerError.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnexpectedInternalServerError.js#L15)

***

### cause

> **cause**?: `unknown`

#### Inherited from

Error.cause

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

Error.message

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `"UnexpectedInternalServerError"` = `'UnexpectedInternalServerError'`

#### Overrides

Error.name

#### Source

[packages/errors/src/client/UnexpectedInternalServerError.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnexpectedInternalServerError.js#L11)

***

### stack

> **stack**?: `string`

#### Inherited from

Error.stack

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### prepareStackTrace

> **`static`** **prepareStackTrace**?: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

Optional override for formatting stack traces

#### Parameters

▪ **err**: `Error`

▪ **stackTraces**: `CallSite`[]

#### Returns

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

##### Inherited from

Error.captureStackTrace

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

##### Inherited from

Error.captureStackTrace

##### Source

node\_modules/.pnpm/@types+node@20.11.19/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

##### Inherited from

Error.captureStackTrace

##### Source

node\_modules/.pnpm/bun-types@1.0.26/node\_modules/bun-types/globals.d.ts:1525

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
