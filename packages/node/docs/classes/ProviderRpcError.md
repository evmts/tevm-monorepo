[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / ProviderRpcError

# Class: ProviderRpcError

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L21)

## Extends

- `Error`

## Constructors

### new ProviderRpcError()

> **new ProviderRpcError**(`code`, `message`): [`ProviderRpcError`](ProviderRpcError.md)

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L25)

#### Parameters

##### code

`number`

##### message

`string`

#### Returns

[`ProviderRpcError`](ProviderRpcError.md)

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### code

> **code**: `number`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L22)

***

### details

> **details**: `string`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L23)

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

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.14.1/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.5/node\_modules/bun-types/globals.d.ts:1441

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`
