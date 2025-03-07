[**@tevm/whatsabi**](../README.md)

***

[@tevm/whatsabi](../globals.md) / UnknownChainError

# Class: UnknownChainError

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L7)

## Extends

- `Error`

## Constructors

### new UnknownChainError()

> **new UnknownChainError**(`chainId`): [`UnknownChainError`](UnknownChainError.md)

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L20)

#### Parameters

##### chainId

`number`

#### Returns

[`UnknownChainError`](UnknownChainError.md)

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"UnknownChainError"` = `'UnknownChainError'`

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L16)

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

> **name**: `"UnknownChainError"` = `'UnknownChainError'`

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L12)

#### Overrides

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
