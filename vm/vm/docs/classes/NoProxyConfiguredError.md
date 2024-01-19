**@tevm/vm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > NoProxyConfiguredError

# Class: NoProxyConfiguredError

## Extends

- `Error`

## Constructors

### new NoProxyConfiguredError(method)

> **new NoProxyConfiguredError**(`method`): [`NoProxyConfiguredError`](NoProxyConfiguredError.md)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

[vm/vm/src/errors/NoProxyConfiguredError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L14)

## Properties

### \_tag

> **\_tag**: `"NoProxyConfiguredError"` = `'NoProxyConfiguredError'`

#### Source

[vm/vm/src/errors/NoProxyConfiguredError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L10)

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

> **name**: `"NoProxyConfiguredError"` = `'NoProxyConfiguredError'`

#### Overrides

Error.name

#### Source

[vm/vm/src/errors/NoProxyConfiguredError.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L6)

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

node\_modules/.pnpm/@types+node@20.9.1/node\_modules/@types/node/globals.d.ts:11

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

node\_modules/.pnpm/@types+node@20.9.1/node\_modules/@types/node/globals.d.ts:13

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

node\_modules/.pnpm/@types+node@20.9.1/node\_modules/@types/node/globals.d.ts:4

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

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
