[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [createRequireEffect](../README.md) / CreateRequireError

# Class: CreateRequireError

Defined in: [packages/effect/src/createRequireEffect.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L6)

## Extends

- `Error`

## Constructors

### new CreateRequireError()

> **new CreateRequireError**(`url`, `options`): [`CreateRequireError`](CreateRequireError.md)

Defined in: [packages/effect/src/createRequireEffect.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L17)

**`Internal`**

#### Parameters

##### url

`string`

##### options

#### Returns

[`CreateRequireError`](CreateRequireError.md)

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"CreateRequireError"` = `'CreateRequireError'`

Defined in: [packages/effect/src/createRequireEffect.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L10)

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

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

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
