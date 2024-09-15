[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / UnsupportedProviderMethodError

# Class: UnsupportedProviderMethodError

## Extends

- `ProviderRpcError`

## Constructors

### new UnsupportedProviderMethodError()

> **new UnsupportedProviderMethodError**(`cause`, `__namedParameters`?): [`UnsupportedProviderMethodError`](UnsupportedProviderMethodError.md)

#### Parameters

• **cause**: `Error`

• **\_\_namedParameters?**

• **\_\_namedParameters.method?**: `string`

#### Returns

[`UnsupportedProviderMethodError`](UnsupportedProviderMethodError.md)

#### Overrides

`ProviderRpcError.constructor`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:236

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

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:20

***

### data?

> `optional` **data**: `undefined`

#### Inherited from

`ProviderRpcError.data`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:33

***

### details

> **details**: `string`

#### Inherited from

`ProviderRpcError.details`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:19

***

### docsPath?

> `optional` **docsPath**: `string`

#### Inherited from

`ProviderRpcError.docsPath`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:20

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

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:21

***

### name

> **name**: `string`

#### Inherited from

`ProviderRpcError.name`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:24

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

`ProviderRpcError.shortMessage`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:22

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

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:23

***

### code

> `static` **code**: `4200`

#### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:235

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

#### walk()

> **walk**(): `Error`

##### Returns

`Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:26

#### walk(fn)

> **walk**(`fn`): `null` \| `Error`

##### Parameters

• **fn**

##### Returns

`null` \| `Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:27

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

node\_modules/.pnpm/@types+node@20.14.15/node\_modules/@types/node/globals.d.ts:21

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

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67
