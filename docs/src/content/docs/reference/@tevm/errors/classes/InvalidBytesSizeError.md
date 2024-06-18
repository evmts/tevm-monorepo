---
editUrl: false
next: false
prev: false
title: "InvalidBytesSizeError"
---

Represents an error that occurs when the size of the bytes does not match the expected size.

## Example

```typescript
import { InvalidBytesSizeError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidBytesSizeError
} catch (error) {
  if (error instanceof InvalidBytesSizeError) {
    console.error(error.message);
    // Handle the invalid bytes size error
  }
}
```

## Param

The actual size of the bytes.

## Param

The expected size of the bytes.

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`InternalError`](/reference/tevm/errors/classes/internalerror/)

## Constructors

### new InvalidBytesSizeError()

> **new InvalidBytesSizeError**(`size`, `expectedSize`, `message`?, `args`?): [`InvalidBytesSizeError`](/reference/tevm/errors/classes/invalidbytessizeerror/)

Constructs an InvalidBytesSizeError.

#### Parameters

• **size**: `number`

The actual size of the bytes.

• **expectedSize**: `number`

The expected size of the bytes.

• **message?**: `string`= `undefined`

Human-readable error message.

• **args?**: [`InvalidBytesSizeErrorParameters`](/reference/tevm/errors/interfaces/invalidbytessizeerrorparameters/)= `{}`

Additional parameters for the BaseError.

#### Returns

[`InvalidBytesSizeError`](/reference/tevm/errors/classes/invalidbytessizeerror/)

#### Overrides

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`constructor`](/reference/tevm/errors/classes/internalerror/#constructors)

#### Source

[packages/errors/src/data/InvalidByteSizeError.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/data/InvalidByteSizeError.js#L54)

## Properties

### \_tag

> **\_tag**: `string` = `'InternalError'`

Same as name, used internally.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`_tag`](/reference/tevm/errors/classes/internalerror/#_tag)

#### Source

[packages/errors/src/ethereum/InternalErrorError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`cause`](/reference/tevm/errors/classes/internalerror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`code`](/reference/tevm/errors/classes/internalerror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`details`](/reference/tevm/errors/classes/internalerror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`docsPath`](/reference/tevm/errors/classes/internalerror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### expectedSize

> **expectedSize**: `number`

The expected size of the bytes.

#### Source

[packages/errors/src/data/InvalidByteSizeError.js:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/data/InvalidByteSizeError.js#L80)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`message`](/reference/tevm/errors/classes/internalerror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`meta`](/reference/tevm/errors/classes/internalerror/#meta)

#### Source

[packages/errors/src/ethereum/InternalErrorError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`metaMessages`](/reference/tevm/errors/classes/internalerror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string` = `'InternalError'`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`name`](/reference/tevm/errors/classes/internalerror/#name)

#### Source

[packages/errors/src/ethereum/InternalErrorError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`shortMessage`](/reference/tevm/errors/classes/internalerror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### size

> **size**: `number`

The actual size of the bytes.

#### Source

[packages/errors/src/data/InvalidByteSizeError.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/data/InvalidByteSizeError.js#L75)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stack`](/reference/tevm/errors/classes/internalerror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`version`](/reference/tevm/errors/classes/internalerror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/internalerror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/internalerror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:30

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`walk`](/reference/tevm/errors/classes/internalerror/#walk)

#### Source

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.13/node\_modules/bun-types/globals.d.ts:1613
