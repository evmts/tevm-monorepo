---
editUrl: false
next: false
prev: false
title: "UnsupportedMethodError"
---

Error when a given JSON-RPC method is not supported

## Extends

- `Error`

## Constructors

### new UnsupportedMethodError(method)

> **new UnsupportedMethodError**(`method`): [`UnsupportedMethodError`](/generated/tevm/vm/classes/unsupportedmethoderror/)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

[vm/vm/src/errors/UnsupportedMethodError.js:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnsupportedMethodError.js#L17)

## Properties

### \_tag

> **\_tag**: `"UnsupportedMethodError"` = `'UnsupportedMethodError'`

#### Source

[vm/vm/src/errors/UnsupportedMethodError.js:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnsupportedMethodError.js#L13)

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

> **name**: `"UnsupportedMethodError"` = `'UnsupportedMethodError'`

#### Overrides

Error.name

#### Source

[vm/vm/src/errors/UnsupportedMethodError.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnsupportedMethodError.js#L9)

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

#### Parameters

▪ **err**: `Error`

▪ **stackTraces**: `CallSite`[]

#### Returns

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Source

node\_modules/.pnpm/bun-types@1.0.21/node\_modules/bun-types/types.d.ts:2235

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

node\_modules/.pnpm/bun-types@1.0.21/node\_modules/bun-types/types.d.ts:2239

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

node\_modules/.pnpm/bun-types@1.0.21/node\_modules/bun-types/types.d.ts:2228

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

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
