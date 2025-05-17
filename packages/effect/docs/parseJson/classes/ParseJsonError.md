[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [parseJson](../README.md) / ParseJsonError

# Class: ParseJsonError

Defined in: [packages/effect/src/parseJson.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L8)

**`Internal`**

Error thrown when the tsconfig.json file is not valid json

## Extends

- `Error`

## Constructors

### Constructor

> **new ParseJsonError**(`options?`): `ParseJsonError`

Defined in: [packages/effect/src/parseJson.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L17)

#### Parameters

##### options?

###### cause?

`unknown`

#### Returns

`ParseJsonError`

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"ParseJsonError"` = `'ParseJsonError'`

Defined in: [packages/effect/src/parseJson.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L12)

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

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

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
