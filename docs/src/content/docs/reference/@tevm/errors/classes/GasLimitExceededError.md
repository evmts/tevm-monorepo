---
editUrl: false
next: false
prev: false
title: "GasLimitExceededError"
---

Represents an error that occurs when the gas limit is exceeded.
This class is abstract and should be extended by other error classes.

This error is typically encountered when a transaction or set of transactions exceed the specified gas limit.

## Example

```ts
try {
  // Some operation that can throw a GasLimitExceededError
} catch (error) {
  if (error instanceof GasLimitExceededError) {
    console.error(error.message);
    // Handle the gas limit exceeded error
  }
}
```

## Abstract

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](/reference/tevm/errors/classes/baseerror/)

## Extended by

- [`OutOfGasError`](/reference/tevm/errors/classes/outofgaserror/)
- [`CodeStoreOutOfGasError`](/reference/tevm/errors/classes/codestoreoutofgaserror/)
- [`CodeSizeExceedsMaximumError`](/reference/tevm/errors/classes/codesizeexceedsmaximumerror/)

## Constructors

### new GasLimitExceededError()

> **new GasLimitExceededError**(`message`, `args`?): [`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/)

Constructs a GasLimitExceededError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`GasLimitExceededErrorParameters`](/reference/tevm/errors/interfaces/gaslimitexceedederrorparameters/)= `{}`

Additional parameters for the BaseError.

#### Returns

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/)

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`constructor`](/reference/tevm/errors/classes/baseerror/#constructors)

#### Source

[packages/errors/src/ethereum/GasLimitExceededError.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/GasLimitExceededError.js#L50)

## Properties

### \_tag

> **\_tag**: `string` = `'GasLimitExceeded'`

Same as name, used internally.

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`_tag`](/reference/tevm/errors/classes/baseerror/#_tag)

#### Source

[packages/errors/src/ethereum/GasLimitExceededError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/GasLimitExceededError.js#L76)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`cause`](/reference/tevm/errors/classes/baseerror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L115)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`code`](/reference/tevm/errors/classes/baseerror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`details`](/reference/tevm/errors/classes/baseerror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L92)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`docsPath`](/reference/tevm/errors/classes/baseerror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L97)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`message`](/reference/tevm/errors/classes/baseerror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Source

[packages/errors/src/ethereum/GasLimitExceededError.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/GasLimitExceededError.js#L68)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`metaMessages`](/reference/tevm/errors/classes/baseerror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L101)

***

### name

> **name**: `string` = `'GasLimitExceeded'`

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`name`](/reference/tevm/errors/classes/baseerror/#name)

#### Source

[packages/errors/src/ethereum/GasLimitExceededError.js:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/GasLimitExceededError.js#L83)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`shortMessage`](/reference/tevm/errors/classes/baseerror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L105)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stack`](/reference/tevm/errors/classes/baseerror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`version`](/reference/tevm/errors/classes/baseerror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L109)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/baseerror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/baseerror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:30

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

#### Source

[packages/errors/src/ethereum/BaseError.js:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L138)

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

##### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:21

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

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
