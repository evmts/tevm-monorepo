[**@tevm/server**](../README.md)

***

[@tevm/server](../globals.md) / ReadRequestBodyError

# Class: ReadRequestBodyError

Defined in: [packages/server/src/errors/ReadRequestBodyError.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/errors/ReadRequestBodyError.js#L29)

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

> **new ReadRequestBodyError**(`message`, `args`?): `ReadRequestBodyError`

Defined in: [packages/server/src/errors/ReadRequestBodyError.js:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/errors/ReadRequestBodyError.js#L36)

Constructs a ReadRequestBodyError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ReadRequestBodyErrorParameters`](../interfaces/ReadRequestBodyErrorParameters.md) = `{}`

Additional parameters for the ReadRequestBodyError.

#### Returns

`ReadRequestBodyError`

#### Overrides

`BaseError.constructor`

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

`BaseError._tag`

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

`BaseError.cause`

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

Error code, analogous to the code in JSON RPC error.

#### Inherited from

`BaseError.code`

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

`BaseError.details`

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

`BaseError.docsPath`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

`BaseError.message`

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

`BaseError.metaMessages`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

`BaseError.name`

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

`BaseError.shortMessage`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`BaseError.stack`

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

`BaseError.version`

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

`BaseError.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`BaseError.stackTraceLimit`

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:71

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

`BaseError.walk`

***

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

`BaseError.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.11/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`BaseError.captureStackTrace`

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

`BaseError.captureStackTrace`
