**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [vm](../README.md) > ProxyFetchError

# Class: ProxyFetchError

Error when there is a problem with the underlying forked provider
Potentially could be network issues

## Extends

- `Error`

## Constructors

### new ProxyFetchError(method)

> **new ProxyFetchError**(`method`): [`ProxyFetchError`](ProxyFetchError.md)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

vm/vm/dist/index.d.ts:207

## Properties

### \_tag

> **\_tag**: `"ProxyFetchError"`

#### Source

vm/vm/dist/index.d.ts:216

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

> **name**: `"ProxyFetchError"`

#### Overrides

Error.name

#### Source

vm/vm/dist/index.d.ts:212

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

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

#### Inherited from

Error.captureStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.9.1/node\_modules/@types/node/globals.d.ts:4

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)