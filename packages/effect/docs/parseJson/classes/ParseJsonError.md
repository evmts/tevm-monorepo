[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [parseJson](../README.md) / ParseJsonError

# Class: ParseJsonError

**`Internal`**

Error thrown when the tsconfig.json file is not valid json

## Extends

- `Error`

## Constructors

### new ParseJsonError()

> **new ParseJsonError**(`options`?): [`ParseJsonError`](ParseJsonError.md)

#### Parameters

• **options?** = `{}`

• **options.cause?**: `unknown`

#### Returns

[`ParseJsonError`](ParseJsonError.md)

#### Overrides

`Error.constructor`

#### Defined in

[packages/effect/src/parseJson.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L17)

## Properties

### \_tag

> **\_tag**: `"ParseJsonError"` = `'ParseJsonError'`

#### Defined in

[packages/effect/src/parseJson.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L12)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

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
