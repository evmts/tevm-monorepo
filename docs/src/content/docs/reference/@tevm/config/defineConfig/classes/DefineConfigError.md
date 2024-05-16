---
editUrl: false
next: false
prev: false
title: "DefineConfigError"
---

Error class for [defineConfig](../../../../../../../../reference/tevm/config/defineconfig/functions/defineconfig)

## Extends

- `Error`

## Constructors

### new DefineConfigError()

> **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/)

#### Parameters

• **configFilePath**: `string`

• **underlyingError**: [`DefineConfigErrorType`](/reference/tevm/config/types/type-aliases/defineconfigerrortype/)

#### Returns

[`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/)

#### Overrides

`Error.constructor`

#### Source

[bundler-packages/config/src/defineConfig.js:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L22)

## Properties

### \_tag

> **\_tag**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Source

[bundler-packages/config/src/defineConfig.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L17)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Overrides

`Error.name`

#### Source

[bundler-packages/config/src/defineConfig.js:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L13)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

`Error.prepareStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21
