[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [resolve](../README.md) / CouldNotResolveImportError

# Class: CouldNotResolveImportError

Error thrown when 'node:resolve' throws

## Extends

- `Error`

## Constructors

### new CouldNotResolveImportError()

> **new CouldNotResolveImportError**(`importPath`, `absolutePath`, `cause`): [`CouldNotResolveImportError`](CouldNotResolveImportError.md)

#### Parameters

• **importPath**: `string`

• **absolutePath**: `string`

• **cause**: `Error`

#### Returns

[`CouldNotResolveImportError`](CouldNotResolveImportError.md)

#### Overrides

`Error.constructor`

#### Source

bundler-packages/effect/src/resolve.js:26

## Properties

### \_tag

> **\_tag**: `"CouldNotResolveImportError"` = `'CouldNotResolveImportError'`

#### Source

bundler-packages/effect/src/resolve.js:15

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

> **name**: `"CouldNotResolveImportError"` = `'CouldNotResolveImportError'`

#### Overrides

`Error.name`

#### Source

bundler-packages/effect/src/resolve.js:20

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

node\_modules/.pnpm/@types+node@20.12.12/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.12.12/node\_modules/@types/node/globals.d.ts:30

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

node\_modules/.pnpm/@types+node@20.12.12/node\_modules/@types/node/globals.d.ts:21
