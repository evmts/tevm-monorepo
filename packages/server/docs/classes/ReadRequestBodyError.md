[**@tevm/server**](../README.md) • **Docs**

***

[@tevm/server](../globals.md) / ReadRequestBodyError

# Class: ReadRequestBodyError

Represents an error that occurs when reading the request body from an HTTP request fails.

This error is typically encountered when there is an issue with reading the request body, such as a network error or a problem with the incoming request stream.

## Param

A human-readable error message.

## Param

Additional parameters for the ReadRequestBodyError.

## Extends

- `BaseError`

## Constructors

### new ReadRequestBodyError()

> **new ReadRequestBodyError**(`message`, `args`?): [`ReadRequestBodyError`](ReadRequestBodyError.md)

Constructs a ReadRequestBodyError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`ReadRequestBodyErrorParameters`](../interfaces/ReadRequestBodyErrorParameters.md) = `{}`

Additional parameters for the ReadRequestBodyError.

#### Returns

[`ReadRequestBodyError`](ReadRequestBodyError.md)

#### Overrides

`BaseError.constructor`

#### Defined in

[packages/server/src/errors/ReadRequestBodyError.js:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/errors/ReadRequestBodyError.js#L36)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

`BaseError._tag`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:40

***

### cause

> **cause**: `any`

#### Inherited from

`BaseError.cause`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

`BaseError.code`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

`BaseError.details`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

`BaseError.docsPath`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

`BaseError.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

`BaseError.metaMessages`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

`BaseError.name`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

`BaseError.shortMessage`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`BaseError.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

`BaseError.version`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

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

`BaseError.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`BaseError.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Walks through the error chain.

#### Parameters

• **fn?**: `Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

`BaseError.walk`

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:71

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

`BaseError.captureStackTrace`

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

`BaseError.captureStackTrace`

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

`BaseError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
