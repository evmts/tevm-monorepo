[**@tevm/config**](../../README.md)

***

[@tevm/config](../../modules.md) / [loadConfig](../README.md) / LoadConfigError

# Class: LoadConfigError

Defined in: [bundler-packages/config/src/loadConfig.js:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L16)

Error class for [loadConfig](../functions/loadConfig.md)

## Extends

- `Error`

## Constructors

### Constructor

> **new LoadConfigError**(`configFilePath`, `underlyingError`): `LoadConfigError`

Defined in: [bundler-packages/config/src/loadConfig.js:30](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L30)

#### Parameters

##### configFilePath

`string`

##### underlyingError

[`LoadConfigErrorType`](../type-aliases/LoadConfigErrorType.md)

#### Returns

`LoadConfigError`

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"InvalidConfigError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

Defined in: [bundler-packages/config/src/loadConfig.js:25](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L25)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `"FoundryNotFoundError"` \| `"FoundryConfigError"` \| `"InvalidRemappingsError"` \| `"InvalidConfigError"` \| `"FailedToReadConfigError"` \| `"InvalidJsonConfigError"` \| `"ParseJsonError"` \| `"NoPluginInTsConfigFoundError"`

Defined in: [bundler-packages/config/src/loadConfig.js:21](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L21)

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:143

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

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:136

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
