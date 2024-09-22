---
editUrl: false
next: false
prev: false
title: "MisconfiguredClientError"
---

Represents an error that occurs when the Client is misconfigured.

This error can be thrown when:
- Incorrect configuration parameters are provided when creating a Client.
- The Client is used in a way that's incompatible with its configuration.

## Example

```typescript
import { createMemoryClient } from '@tevm/memory-client'
import { MisconfiguredClientError } from '@tevm/errors'

const memoryClient = createMemoryClient({
  // Assume we've misconfigured something here
})

try {
  await memoryClient.tevmCall({
    to: '0x...',
    data: '0x...',
  })
} catch (error) {
  if (error instanceof MisconfiguredClientError) {
    console.error('Client misconfiguration:', error.message)
    console.log('Documentation:', error.docsLink)
    // Attempt to recreate the client with correct configuration
    // or notify the user to check their client setup
  }
}
```

## Extends

- [`InternalError`](/reference/tevm/errors/classes/internalerror/)

## Constructors

### new MisconfiguredClientError()

> **new MisconfiguredClientError**(`message`?, `args`?): [`MisconfiguredClientError`](/reference/tevm/errors/classes/misconfiguredclienterror/)

Constructs a MisconfiguredClientError.

#### Parameters

• **message?**: `string` = `'Misconfigured client error occurred.'`

Human-readable error message.

• **args?**: [`MisconfiguredClientErrorParameters`](/reference/tevm/errors/interfaces/misconfiguredclienterrorparameters/) = `{}`

Additional parameters for the error.

#### Returns

[`MisconfiguredClientError`](/reference/tevm/errors/classes/misconfiguredclienterror/)

#### Overrides

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`constructor`](/reference/tevm/errors/classes/internalerror/#constructors)

#### Defined in

[packages/errors/src/client/MisconfiguredClient.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/MisconfiguredClient.js#L55)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`_tag`](/reference/tevm/errors/classes/internalerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L68)

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`cause`](/reference/tevm/errors/classes/internalerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code (-32603), standard JSON-RPC error code for internal errors.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`code`](/reference/tevm/errors/classes/internalerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`details`](/reference/tevm/errors/classes/internalerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`docsPath`](/reference/tevm/errors/classes/internalerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`message`](/reference/tevm/errors/classes/internalerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`meta`](/reference/tevm/errors/classes/internalerror/#meta)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L69)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`metaMessages`](/reference/tevm/errors/classes/internalerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`name`](/reference/tevm/errors/classes/internalerror/#name)

#### Defined in

[packages/errors/src/ethereum/InternalErrorError.js:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L67)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`shortMessage`](/reference/tevm/errors/classes/internalerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`stack`](/reference/tevm/errors/classes/internalerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](/reference/tevm/errors/classes/internalerror/).[`version`](/reference/tevm/errors/classes/internalerror/#version)

#### Defined in

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

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67

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

node\_modules/.pnpm/@types+node@20.14.15/node\_modules/@types/node/globals.d.ts:21

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

node\_modules/.pnpm/bun-types@1.1.22/node\_modules/bun-types/globals.d.ts:1629

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
