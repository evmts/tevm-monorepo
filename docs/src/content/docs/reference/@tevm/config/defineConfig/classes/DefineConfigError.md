---
editUrl: false
next: false
prev: false
title: "DefineConfigError"
---

Error class for [defineConfig](/reference/tevm/config/defineconfig/functions/defineconfig/)

## Extends

- `Error`

## Constructors

### new DefineConfigError(configFilePath, underlyingError)

> **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/)

#### Parameters

▪ **configFilePath**: `string`

▪ **underlyingError**: [`DefineConfigErrorType`](/reference/tevm/config/types/type-aliases/defineconfigerrortype/)

#### Overrides

Error.constructor

#### Source

[bundler-packages/config/src/defineConfig.js:26](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L26)

## Properties

### \_tag

> **\_tag**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Source

[bundler-packages/config/src/defineConfig.js:21](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L21)

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

> **name**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Overrides

Error.name

#### Source

[bundler-packages/config/src/defineConfig.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L17)

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

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

#### Inherited from

Error.captureStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
