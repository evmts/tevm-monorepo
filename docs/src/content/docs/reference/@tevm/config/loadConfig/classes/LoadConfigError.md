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

#### Defined in

[bundler-packages/config/src/loadConfig.js:30](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L30)

## Properties

### \_tag

> **\_tag**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"InvalidConfigError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Defined in

[bundler-packages/config/src/loadConfig.js:25](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L25)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"InvalidConfigError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Overrides

`Error.name`

#### Defined in

[bundler-packages/config/src/loadConfig.js:21](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L21)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
