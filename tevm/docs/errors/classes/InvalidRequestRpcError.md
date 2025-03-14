[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidRequestRpcError

# Class: InvalidRequestRpcError

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/rpc.d.ts:60

## Extends

- `RpcError`

## Constructors

### new InvalidRequestRpcError()

> **new InvalidRequestRpcError**(`cause`): [`InvalidRequestRpcError`](InvalidRequestRpcError.md)

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/rpc.d.ts:62

#### Parameters

##### cause

`Error`

#### Returns

[`InvalidRequestRpcError`](InvalidRequestRpcError.md)

#### Overrides

`RpcError.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`RpcError.cause`

***

### code

> **code**: `RpcErrorCode` \| `number` & `object`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/rpc.d.ts:20

#### Inherited from

`RpcError.code`

***

### details

> **details**: `string`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:19

#### Inherited from

`RpcError.details`

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:20

#### Inherited from

`RpcError.docsPath`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`RpcError.message`

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:21

#### Inherited from

`RpcError.metaMessages`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:24

#### Inherited from

`RpcError.name`

***

### shortMessage

> **shortMessage**: `string`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:22

#### Inherited from

`RpcError.shortMessage`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`RpcError.stack`

***

### version

> **version**: `string`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:23

#### Inherited from

`RpcError.version`

***

### code

> `static` **code**: `-32600`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/rpc.d.ts:61

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

`RpcError.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`RpcError.stackTraceLimit`

## Methods

### walk()

#### Call Signature

> **walk**(): `Error`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:26

##### Returns

`Error`

##### Inherited from

`RpcError.walk`

#### Call Signature

> **walk**(`fn`): `null` \| `Error`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/errors/base.d.ts:27

##### Parameters

###### fn

(`err`) => `boolean`

##### Returns

`null` \| `Error`

##### Inherited from

`RpcError.walk`

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

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

`RpcError.captureStackTrace`
