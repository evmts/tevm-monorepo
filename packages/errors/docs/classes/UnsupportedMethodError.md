[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / UnsupportedMethodError

# Class: UnsupportedMethodError

Error when a given JSON-RPC method is not supported

## Extends

- `Error`

## Constructors

### new UnsupportedMethodError()

> **new UnsupportedMethodError**(`method`): [`UnsupportedMethodError`](UnsupportedMethodError.md)

#### Parameters

• **method**: `string`

#### Returns

[`UnsupportedMethodError`](UnsupportedMethodError.md)

#### Overrides

`Error.constructor`

#### Source

[packages/errors/src/client/UnsupportedMethodError.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L17)

## Properties

### \_tag

> **\_tag**: `"UnsupportedMethodError"` = `'UnsupportedMethodError'`

#### Source

[packages/errors/src/client/UnsupportedMethodError.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L13)

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

> **name**: `"UnsupportedMethodError"` = `'UnsupportedMethodError'`

#### Overrides

`Error.name`

#### Source

[packages/errors/src/client/UnsupportedMethodError.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L9)

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

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
