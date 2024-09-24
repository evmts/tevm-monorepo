[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / DefensiveNullCheckError

# Class: DefensiveNullCheckError

Represents an error that occurs when a defensive null check is tripped.
This error should never be thrown and indicates a bug in the Tevm VM if it is thrown.

## Example

```javascript
import { DefensiveNullCheckError } from '@tevm/errors'

function assertNotNull(value, message) {
  if (value === null || value === undefined) {
    throw new DefensiveNullCheckError(message)
  }
  return value
}

try {
  const result = someFunction()
  assertNotNull(result, 'Result should not be null')
} catch (error) {
  if (error instanceof DefensiveNullCheckError) {
    console.error('Unexpected null value:', error.message)
    // This indicates a bug in the Tevm VM
    reportBugToTevmRepository(error)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### new DefensiveNullCheckError()

> **new DefensiveNullCheckError**(`message`?, `args`?): [`DefensiveNullCheckError`](DefensiveNullCheckError.md)

Constructs a DefensiveNullCheckError.

#### Parameters

• **message?**: `string`

Human-readable error message.

• **args?**: [`DefensiveNullCheckErrorParameters`](../type-aliases/DefensiveNullCheckErrorParameters.md)

Additional parameters for the error.

#### Returns

[`DefensiveNullCheckError`](DefensiveNullCheckError.md)

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructors)

#### Defined in

packages/errors/types/defensive/DefensiveNullCheckError.d.ts:48

## Properties

### \_tag

> **\_tag**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:40

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](InternalError.md).[`message`](InternalError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

#### Defined in

packages/errors/types/ethereum/InternalErrorError.d.ts:58

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](InternalError.md).[`name`](InternalError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`stack`](InternalError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

***

### code

> `static` **code**: `number`

The error code for InternalError.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code-1)

#### Defined in

packages/errors/types/ethereum/InternalErrorError.d.ts:49

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

[`InternalError`](InternalError.md).[`prepareStackTrace`](InternalError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](InternalError.md).[`stackTraceLimit`](InternalError.md#stacktracelimit)

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

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67
