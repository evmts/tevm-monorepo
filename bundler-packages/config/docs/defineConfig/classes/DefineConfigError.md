**@tevm/config** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [defineConfig](../README.md) > DefineConfigError

# Class: DefineConfigError

Error class for [defineConfig](../functions/defineConfig.md)

## Extends

- `Error`

## Constructors

### new DefineConfigError(configFilePath, underlyingError)

> **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](DefineConfigError.md)

#### Parameters

▪ **configFilePath**: `string`

▪ **underlyingError**: [`DefineConfigErrorType`](../../types/type-aliases/DefineConfigErrorType.md)

#### Overrides

Error.constructor

#### Source

[bundler-packages/config/src/defineConfig.js:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L22)

## Properties

### \_tag

> **\_tag**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Source

[bundler-packages/config/src/defineConfig.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L17)

***

### cause

> **cause**?: `unknown`

#### Inherited from

Error.cause

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

Error.message

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Overrides

Error.name

#### Source

[bundler-packages/config/src/defineConfig.js:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L13)

***

### stack

> **stack**?: `string`

#### Inherited from

Error.stack

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace

> **`static`** **prepareStackTrace**?: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

▪ **err**: `Error`

▪ **stackTraces**: `CallSite`[]

#### Inherited from

Error.prepareStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:30

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

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
