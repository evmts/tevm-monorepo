---
editUrl: false
next: false
prev: false
title: "InvalidUrlError"
---

Represents an error that occurs when a URL is invalid.

This error is typically encountered when an operation requires a valid URL, but receives an invalid one.

## Example

```javascript
import { InvalidUrlError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

try {
  const client = createMemoryClient({
    fork: {
      url: 'not_a_valid_url'
    }
  })
} catch (error) {
  if (error instanceof InvalidUrlError) {
    console.error('Invalid URL:', error.message)
    console.log('Documentation:', error.docsLink)
  }
}
```

## Extends

- [`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/)

## Constructors

### new InvalidUrlError()

> **new InvalidUrlError**(`message`, `args`?): [`InvalidUrlError`](/reference/tevm/errors/classes/invalidurlerror/)

Constructs an InvalidUrlError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidUrlErrorParameters`](/reference/tevm/errors/interfaces/invalidurlerrorparameters/) = `{}`

Additional parameters for the InvalidUrlError.

#### Returns

[`InvalidUrlError`](/reference/tevm/errors/classes/invalidurlerror/)

#### Overrides

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`constructor`](/reference/tevm/errors/classes/invalidparamserror/#constructors)

#### Defined in

[packages/errors/src/input/InvalidUrlError.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidUrlError.js#L48)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`_tag`](/reference/tevm/errors/classes/invalidparamserror/#_tag)

#### Defined in

[packages/errors/src/input/InvalidUrlError.js:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidUrlError.js#L60)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`cause`](/reference/tevm/errors/classes/invalidparamserror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`code`](/reference/tevm/errors/classes/invalidparamserror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`details`](/reference/tevm/errors/classes/invalidparamserror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`docsPath`](/reference/tevm/errors/classes/invalidparamserror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`message`](/reference/tevm/errors/classes/invalidparamserror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`metaMessages`](/reference/tevm/errors/classes/invalidparamserror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`name`](/reference/tevm/errors/classes/invalidparamserror/#name)

#### Defined in

[packages/errors/src/input/InvalidUrlError.js:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidUrlError.js#L59)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`shortMessage`](/reference/tevm/errors/classes/invalidparamserror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stack`](/reference/tevm/errors/classes/invalidparamserror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`version`](/reference/tevm/errors/classes/invalidparamserror/#version)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`prepareStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stackTraceLimit`](/reference/tevm/errors/classes/invalidparamserror/#stacktracelimit)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`walk`](/reference/tevm/errors/classes/invalidparamserror/#walk)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
