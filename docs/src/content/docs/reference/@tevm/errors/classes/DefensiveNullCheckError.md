---
editUrl: false
next: false
prev: false
title: "DefensiveNullCheckError"
---

Represents an error that occurs when a defensive null check is tripped.
This error should never be thrown and indicates a bug in the Tevm VM if it is Thrown

Defensive null check errors can occur due to:
- Checking what should be an impossible null value, indicating a bug in TEVM.

To handle this error take the following steps:
- ensure you did not modify the tevm VM in any unsupported way.
- Open an issue with a minimal reproducable example

## Example

```typescript
import { DefensiveNullCheckError } from '@tevm/errors'
function assertNotNull<T>(value: T | null): T {
  const name = 'bob'
  const firstLetter = name[0]
  if (firstLetter === undefined) {
    throw new DefensiveNullCheckError('Null value encountered in assertNotNull')
  }
  return value
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`InternalError`](/reference/tevm/errors/classes/internalerror/)

## Constructors

### new DefensiveNullCheckError()

> **new DefensiveNullCheckError**(`message`?, `args`?): [`DefensiveNullCheckError`](/reference/tevm/errors/classes/defensivenullcheckerror/)

Constructs a DefensiveNullCheckError.

#### Parameters

• **message?**: `string`= `'Defensive null check error occurred.'`

Human-readable error message.

• **args?**: [`DefensiveNullCheckErrorParameters`](/reference/tevm/errors/interfaces/defensivenullcheckerrorparameters/)= `{}`

Additional parameters for the BaseError.

#### Returns

[`DefensiveNullCheckError`](/reference/tevm/errors/classes/defensivenullcheckerror/)

#### Overrides

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`constructor`](/reference/tevm/errors/classes/internalerror/#constructors)

#### Source

[packages/errors/src/defensive/DefensiveNullCheckError.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/DefensiveNullCheckError.js#L56)

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

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/internalerror/#stacktracelimit)

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

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`captureStackTrace`](/reference/tevm/errors/classes/internalerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613