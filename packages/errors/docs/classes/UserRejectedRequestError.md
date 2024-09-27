[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / UserRejectedRequestError

# Class: UserRejectedRequestError

## Extends

- `ProviderRpcError`

## Constructors

### new UserRejectedRequestError()

> **new UserRejectedRequestError**(`cause`): [`UserRejectedRequestError`](UserRejectedRequestError.md)

#### Parameters

• **cause**: `Error`

#### Returns

[`UserRejectedRequestError`](UserRejectedRequestError.md)

#### Overrides

`ProviderRpcError.constructor`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:210

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`ProviderRpcError.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### code

> **code**: `number` & `object` \| `ProviderRpcErrorCode`

#### Inherited from

`ProviderRpcError.code`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:20

***

### data?

> `optional` **data**: `undefined`

#### Inherited from

`ProviderRpcError.data`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:33

***

### details

> **details**: `string`

#### Inherited from

`ProviderRpcError.details`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:19

***

### docsPath?

> `optional` **docsPath**: `string`

#### Inherited from

`ProviderRpcError.docsPath`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:20

***

### message

> **message**: `string`

#### Inherited from

`ProviderRpcError.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

#### Inherited from

`ProviderRpcError.metaMessages`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:21

***

### name

> **name**: `string`

#### Inherited from

`ProviderRpcError.name`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:24

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

`ProviderRpcError.shortMessage`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:22

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`ProviderRpcError.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

`ProviderRpcError.version`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:23

***

### code

> `static` **code**: `4001`

#### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/rpc.d.ts:209

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

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`ProviderRpcError.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

## Methods

### walk()

#### walk()

> **walk**(): `Error`

##### Returns

`Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:26

#### walk(fn)

> **walk**(`fn`): `null` \| `Error`

##### Parameters

• **fn**

##### Returns

`null` \| `Error`

##### Inherited from

`ProviderRpcError.walk`

##### Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/errors/base.d.ts:27

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

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136

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

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630

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
