[**@tevm/config**](../../README.md) • **Docs**

***

[@tevm/config](../../modules.md) / [defineConfig](../README.md) / DefineConfigError

# Class: DefineConfigError

Error class for [defineConfig](../functions/defineConfig.md)

## Extends

- `Error`

## Constructors

### new DefineConfigError()

> **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](DefineConfigError.md)

#### Parameters

• **configFilePath**: `string`

• **underlyingError**: [`DefineConfigErrorType`](../../types/type-aliases/DefineConfigErrorType.md)

#### Returns

[`DefineConfigError`](DefineConfigError.md)

#### Overrides

`Error.constructor`

#### Defined in

[bundler-packages/config/src/defineConfig.js:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L22)

## Properties

### \_tag

> **\_tag**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Defined in

[bundler-packages/config/src/defineConfig.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L17)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"ConfigFnThrowError"` \| `"InvalidConfigError"` \| `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"`

#### Overrides

`Error.name`

#### Defined in

[bundler-packages/config/src/defineConfig.js:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L13)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:30

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

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21
