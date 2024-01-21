**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > NoProxyConfiguredError

# Class: NoProxyConfiguredError

Error thrown when a action or request cannot be fulfilled
without a proxy url being configured

## Extends

- `Error`

## Constructors

### new NoProxyConfiguredError(method)

> **new NoProxyConfiguredError**(`method`): [`NoProxyConfiguredError`](NoProxyConfiguredError.md)

#### Parameters

▪ **method**: `string`

#### Overrides

Error.constructor

#### Source

vm/vm/types/errors/NoProxyConfiguredError.d.ts:9

## Properties

### \_tag

> **\_tag**: `"NoProxyConfiguredError"`

#### Source

vm/vm/types/errors/NoProxyConfiguredError.d.ts:18

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

> **name**: `"NoProxyConfiguredError"`

#### Overrides

Error.name

#### Source

vm/vm/types/errors/NoProxyConfiguredError.d.ts:14

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
