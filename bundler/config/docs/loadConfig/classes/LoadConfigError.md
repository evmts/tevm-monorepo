**@tevm/config** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [loadConfig](../README.md) > LoadConfigError

# Class: LoadConfigError

Error class for [loadConfig](../functions/loadConfig.md)

## Extends

- `Error`

## Constructors

### new LoadConfigError(configFilePath, underlyingError)

> **new LoadConfigError**(`configFilePath`, `underlyingError`): [`LoadConfigError`](LoadConfigError.md)

#### Parameters

▪ **configFilePath**: `string`

▪ **underlyingError**: [`LoadConfigErrorType`](../type-aliases/LoadConfigErrorType.md)

#### Overrides

Error.constructor

#### Source

[bundler/config/src/loadConfig.js:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L40)

## Properties

### \_tag

> **\_tag**: `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Source

[bundler/config/src/loadConfig.js:35](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L35)

***

### cause

> **cause**?: `unknown`

#### Inherited from

Error.cause

#### Source

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

Error.message

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

#### Overrides

Error.name

#### Source

[bundler/config/src/loadConfig.js:31](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L31)

***

### stack

> **stack**?: `string`

#### Inherited from

Error.stack

#### Source

node\_modules/typescript/lib/lib.es5.d.ts:1077

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

bundler/config/node\_modules/@types/node/globals.d.ts:11

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

bundler/config/node\_modules/@types/node/globals.d.ts:13

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

bundler/config/node\_modules/@types/node/globals.d.ts:4

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
