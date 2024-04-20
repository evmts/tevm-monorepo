**@tevm/errors** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/errors](../README.md) / ProxyFetchError

# Class: ProxyFetchError

Error when there is a problem with the underlying forked provider
Potentially could be network issues

## Extends

- `Error`

## Constructors

### new ProxyFetchError(method)

> **new ProxyFetchError**(`method`): [`ProxyFetchError`](ProxyFetchError.md)

#### Parameters

• **method**: `string`

#### Returns

[`ProxyFetchError`](ProxyFetchError.md)

#### Overrides

`Error.constructor`

#### Source

[packages/errors/src/client/ProxyFetchError.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L18)

## Properties

### \_tag

> **\_tag**: `"ProxyFetchError"` = `'ProxyFetchError'`

#### Source

[packages/errors/src/client/ProxyFetchError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L14)

***

### cause?

> **`optional`** **cause**: `unknown`

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

> **name**: `"ProxyFetchError"` = `'ProxyFetchError'`

#### Overrides

`Error.name`

#### Source

[packages/errors/src/client/ProxyFetchError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L10)

***

### stack?

> **`optional`** **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> **`static`** **`optional`** **prepareStackTrace**: (`err`, `stackTraces`) => `any`

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

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.11.30/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/bun-types@1.1.4/node\_modules/bun-types/globals.d.ts:1637
