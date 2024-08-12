---
editUrl: false
next: false
prev: false
title: "UnsupportedProviderMethodError"
---

## Extends

- `ProviderRpcError`

## Constructors

### new UnsupportedProviderMethodError()

> **new UnsupportedProviderMethodError**(`cause`): [`UnsupportedProviderMethodError`](/reference/tevm/errors/classes/unsupportedprovidermethoderror/)

#### Parameters

• **cause**: `Error`

#### Returns

[`UnsupportedProviderMethodError`](/reference/tevm/errors/classes/unsupportedprovidermethoderror/)

#### Overrides

`ProviderRpcError.constructor`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:247

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`ProviderRpcError.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### code

> **code**: `number` & `object` \| `ProviderRpcErrorCode`

#### Inherited from

`ProviderRpcError.code`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:20

***

### data?

> `optional` **data**: `undefined`

#### Inherited from

`ProviderRpcError.data`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:34

***

### details

> **details**: `string`

#### Inherited from

`ProviderRpcError.details`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:17

***

### docsPath?

> `optional` **docsPath**: `string`

#### Inherited from

`ProviderRpcError.docsPath`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:18

***

### message

> **message**: `string`

#### Inherited from

`ProviderRpcError.message`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

#### Inherited from

`ProviderRpcError.metaMessages`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:19

***

### name

> **name**: `string`

#### Overrides

`ProviderRpcError.name`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:245

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

`ProviderRpcError.shortMessage`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:20

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`ProviderRpcError.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

`ProviderRpcError.version`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:22

***

### code

> `static` **code**: `4200`

#### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:246

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`ProviderRpcError.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`ProviderRpcError.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:30

## Methods

### walk()

#### walk(undefined)

> **walk**(): `Error`

##### Returns

`Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:24

#### walk(fn)

> **walk**(`fn`): `null` \| `Error`

##### Parameters

• **fn**

##### Returns

`null` \| `Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:25

***

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

`ProviderRpcError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`ProviderRpcError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@22.2.0/node\_modules/@types/node/globals.d.ts:22

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`ProviderRpcError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`ProviderRpcError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/bun-types@1.1.22/node\_modules/bun-types/globals.d.ts:1629
