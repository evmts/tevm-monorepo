---
editUrl: false
next: false
prev: false
title: "InternalError"
---

Represents an internal JSON-RPC error.

This error is typically encountered when there is an unexpected internal error on the server.
It's a catch-all for errors that don't fall into more specific categories and usually indicates
a problem with the Ethereum node or the JSON-RPC server itself, rather than with the request.

The error code -32603 is a standard JSON-RPC error code for internal errors.

## Example

```ts
try {
  await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // some method call
  })
} catch (error) {
  if (error instanceof InternalError) {
    console.error('Internal error:', error.message);
    console.log('This is likely a problem with the Ethereum node. Try again later or contact the node operator.');
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](/reference/tevm/errors/classes/baseerror/)

## Extended by

- [`MisconfiguredClientError`](/reference/tevm/errors/classes/misconfiguredclienterror/)
- [`DefensiveNullCheckError`](/reference/tevm/errors/classes/defensivenullcheckerror/)
- [`UnreachableCodeError`](/reference/tevm/errors/classes/unreachablecodeerror/)
- [`InvalidBytesSizeError`](/reference/tevm/errors/classes/invalidbytessizeerror/)

## Constructors

### new InternalError()

> **new InternalError**(`message`, `args`?, `tag`?): [`InternalError`](/reference/tevm/errors/classes/internalerror/)

Constructs an InternalError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InternalErrorParameters`](/reference/tevm/errors/interfaces/internalerrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'InternalError'`

The tag for the error.

#### Returns

[`InternalError`](/reference/tevm/errors/classes/internalerror/)

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`constructor`](/reference/tevm/errors/classes/baseerror/#constructors)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L61)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`_tag`](/reference/tevm/errors/classes/baseerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L74)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`cause`](/reference/tevm/errors/classes/baseerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`code`](/reference/tevm/errors/classes/baseerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`details`](/reference/tevm/errors/classes/baseerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`docsPath`](/reference/tevm/errors/classes/baseerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`message`](/reference/tevm/errors/classes/baseerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L75)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`metaMessages`](/reference/tevm/errors/classes/baseerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`name`](/reference/tevm/errors/classes/baseerror/#name)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L73)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`shortMessage`](/reference/tevm/errors/classes/baseerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stack`](/reference/tevm/errors/classes/baseerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`version`](/reference/tevm/errors/classes/baseerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### code

> `static` **code**: `number` = `-32603`

Error code (-32603), standard JSON-RPC error code for internal errors.

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L52)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/baseerror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/baseerror/#stacktracelimit)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`walk`](/reference/tevm/errors/classes/baseerror/#walk)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
