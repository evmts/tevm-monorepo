---
editUrl: false
next: false
prev: false
title: "LoadConfigError"
---

Error class for [loadConfig](../../../../../../../../reference/tevm/config/loadconfig/functions/loadconfig)

## Extends

- `Error`

## Constructors

### new LoadConfigError()

> **new LoadConfigError**(`configFilePath`, `underlyingError`): [`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/)

#### Parameters

• **configFilePath**: `string`

• **underlyingError**: [`LoadConfigErrorType`](/reference/tevm/config/loadconfig/type-aliases/loadconfigerrortype/)

#### Returns

[`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/)

#### Overrides

`Error.constructor`

#### Source

[bundler-packages/config/src/loadConfig.js:29](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L29)

## Properties

### \_tag

> **\_tag**: `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Source

[bundler-packages/config/src/loadConfig.js:24](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L24)

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

> **name**: `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Overrides

`Error.name`

#### Source

[bundler-packages/config/src/loadConfig.js:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L20)

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

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:30

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

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:21
