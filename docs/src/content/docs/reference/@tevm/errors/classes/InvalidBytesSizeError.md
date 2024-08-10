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

> **new InvalidBytesSizeError**(`size`, `expectedSize`, `message`?, `args`?, `tag`?): [`InvalidBytesSizeError`](/reference/tevm/errors/classes/invalidbytessizeerror/)

Constructs an InvalidBytesSizeError.

#### Parameters

• **size**: `number`

The actual size of the bytes.

• **expectedSize**: `number`

The expected size of the bytes.

• **message?**: `string` = `...`

Human-readable error message.

• **args?**: [`InvalidBytesSizeErrorParameters`](/reference/tevm/errors/interfaces/invalidbytessizeerrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'InvalidBytesSizeError'`

The tag for the error.}

#### Returns

[`InvalidBytesSizeError`](/reference/tevm/errors/classes/invalidbytessizeerror/)

#### Overrides

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`constructor`](/reference/tevm/errors/classes/internalerror/#constructors)

#### Defined in

[packages/errors/src/data/InvalidByteSizeError.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/data/InvalidByteSizeError.js#L55)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`_tag`](/reference/tevm/errors/classes/internalerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`cause`](/reference/tevm/errors/classes/internalerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`code`](/reference/tevm/errors/classes/internalerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`details`](/reference/tevm/errors/classes/internalerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`docsPath`](/reference/tevm/errors/classes/internalerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`message`](/reference/tevm/errors/classes/internalerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`meta`](/reference/tevm/errors/classes/internalerror/#meta)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L64)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`metaMessages`](/reference/tevm/errors/classes/internalerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`name`](/reference/tevm/errors/classes/internalerror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`shortMessage`](/reference/tevm/errors/classes/internalerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stack`](/reference/tevm/errors/classes/internalerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`version`](/reference/tevm/errors/classes/internalerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

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

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/internalerror/#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:30

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

#### Defined in

[packages/errors/src/ethereum/BaseError.js:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L136)

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.1.0/node\_modules/@types/node/globals.d.ts:22

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

##### Defined in

node\_modules/.pnpm/bun-types@1.1.18/node\_modules/bun-types/globals.d.ts:1613

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

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
