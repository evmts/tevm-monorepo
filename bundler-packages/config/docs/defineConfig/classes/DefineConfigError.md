[**@tevm/config**](../../README.md)

***

[@tevm/config](../../modules.md) / [defineConfig](../README.md) / DefineConfigError

# Class: DefineConfigError

Defined in: [bundler-packages/config/src/defineConfig.js:8](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L8)

Error class for [defineConfig](../functions/defineConfig.md)

## Extends

- `Error`

## Constructors

### new DefineConfigError()

> **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](DefineConfigError.md)

Defined in: [bundler-packages/config/src/defineConfig.js:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L22)

#### Parameters

##### configFilePath

`string`

##### underlyingError

[`DefineConfigErrorType`](../../types/type-aliases/DefineConfigErrorType.md)

#### Returns

[`DefineConfigError`](DefineConfigError.md)

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"ConfigFnThrowError"` \| `"InvalidConfigError"`

Defined in: [bundler-packages/config/src/defineConfig.js:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L17)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"ConfigFnThrowError"` \| `"InvalidConfigError"`

Defined in: [bundler-packages/config/src/defineConfig.js:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L13)

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
