---
editUrl: false
next: false
prev: false
title: "ProviderRpcError"
---

## Extends

- `Error`

## Constructors

### new ProviderRpcError(code, message)

> **new ProviderRpcError**(`code`, `message`): [`ProviderRpcError`](/reference/tevm/decorators/classes/providerrpcerror/)

#### Parameters

• **code**: `number`

• **message**: `string`

#### Returns

[`ProviderRpcError`](/reference/tevm/decorators/classes/providerrpcerror/)

#### Overrides

`Error.constructor`

#### Source

[packages/decorators/src/eip1193/EIP1193Events.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L21)

## Properties

### cause?

> **`optional`** **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### code

> **code**: `number`

#### Source

[packages/decorators/src/eip1193/EIP1193Events.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L18)

***

### details

> **details**: `string`

#### Source

[packages/decorators/src/eip1193/EIP1193Events.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L19)

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1076

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

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

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

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

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
