**@tevm/vm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > UnexpectedInternalServerError

# Class: UnexpectedInternalServerError

Error that is thrown when something unexpected happens
THis error being thrown indicates a bug or unhandled error
internally in tevm and thus shouldn't happen often

## Extends

- `Error`

## Constructors

### new UnexpectedInternalServerError(method)

> **new UnexpectedInternalServerError**(`method`): [`UnexpectedInternalServerError`](UnexpectedInternalServerError.md)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

[vm/vm/src/errors/UnexpectedInternalServerError.js:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L19)

## Properties

### \_tag

> **\_tag**: `"UnexpectedInternalServerError"` = `'UnexpectedInternalServerError'`

#### Source

[vm/vm/src/errors/UnexpectedInternalServerError.js:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L15)

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

[vm/vm/src/errors/UnexpectedInternalServerError.js:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L11)

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
