[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / ProviderRpcError

# Class: ProviderRpcError

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L21)

## Extends

- `Error`

## Constructors

### Constructor

> **new ProviderRpcError**(`code`, `message`): `ProviderRpcError`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L25)

#### Parameters

##### code

`number`

##### message

`string`

#### Returns

`ProviderRpcError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

The cause of the error.

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

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:962

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

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:967

The maximum number of stack frames to capture.

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:955

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.3/node\_modules/@types/node/globals.d.ts:136

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

***

### isError()

> `static` **isError**(`value`): `value is Error`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:950

Check if a value is an instance of Error

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

#### Inherited from

`Error.isError`
