[**@tevm/whatsabi**](../README.md) • **Docs**

***

[@tevm/whatsabi](../globals.md) / UnknownChainError

# Class: UnknownChainError

## Extends

- `Error`

## Constructors

### new UnknownChainError()

> **new UnknownChainError**(`chainId`): [`UnknownChainError`](UnknownChainError.md)

#### Parameters

• **chainId**: `number`

#### Returns

[`UnknownChainError`](UnknownChainError.md)

#### Overrides

`Error.constructor`

#### Defined in

[bundler-packages/whatsabi/src/resolveContractUri.js:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L20)

## Properties

### \_tag

> **\_tag**: `"UnknownChainError"` = `'UnknownChainError'`

#### Defined in

[bundler-packages/whatsabi/src/resolveContractUri.js:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L16)

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

> **name**: `"UnknownChainError"` = `'UnknownChainError'`

#### Overrides

`Error.name`

#### Defined in

[bundler-packages/whatsabi/src/resolveContractUri.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L12)

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
