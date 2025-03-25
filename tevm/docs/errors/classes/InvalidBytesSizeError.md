[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidBytesSizeError

# Class: InvalidBytesSizeError

Defined in: packages/errors/types/data/InvalidByteSizeError.d.ts:40

Represents an error that occurs when the size of the bytes does not match the expected size.

## Example

```javascript
import { InvalidBytesSizeError } from '@tevm/errors'
import { hexToBytes } from '@tevm/utils'

function requireBytes32(value) {
  const bytes = hexToBytes(value)
  if (bytes.length !== 32) {
    throw new InvalidBytesSizeError(bytes.length, 32)
  }
  return bytes
}

try {
  requireBytes32('0x1234') // This will throw an InvalidBytesSizeError
} catch (error) {
  if (error instanceof InvalidBytesSizeError) {
    console.error(`Invalid bytes size: ${error.message}`)
    console.log(`Actual size: ${error.size}, Expected size: ${error.expectedSize}`)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### new InvalidBytesSizeError()

> **new InvalidBytesSizeError**(`size`, `expectedSize`, `message`?, `args`?): `InvalidBytesSizeError`

Defined in: packages/errors/types/data/InvalidByteSizeError.d.ts:49

Constructs an InvalidBytesSizeError.

#### Parameters

##### size

`number`

The actual size of the bytes.

##### expectedSize

`number`

The expected size of the bytes.

##### message?

`string`

Human-readable error message.

##### args?

[`InvalidBytesSizeErrorParameters`](../type-aliases/InvalidBytesSizeErrorParameters.md)

Additional parameters for the error.

#### Returns

`InvalidBytesSizeError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

***

### expectedSize

> **expectedSize**: `number`

Defined in: packages/errors/types/data/InvalidByteSizeError.d.ts:59

The expected size of the bytes.

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`InternalError`](InternalError.md).[`message`](InternalError.md#message)

***

### meta

> **meta**: `undefined` \| `object`

Defined in: packages/errors/types/ethereum/InternalErrorError.d.ts:58

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](InternalError.md).[`name`](InternalError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

***

### size

> **size**: `number`

Defined in: packages/errors/types/data/InvalidByteSizeError.d.ts:54

The actual size of the bytes.

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`InternalError`](InternalError.md).[`stack`](InternalError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

***

### code

> `static` **code**: `number`

Defined in: packages/errors/types/ethereum/InternalErrorError.d.ts:49

The error code for InternalError.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code-1)

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

[`InternalError`](InternalError.md).[`prepareStackTrace`](InternalError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`InternalError`](InternalError.md).[`stackTraceLimit`](InternalError.md#stacktracelimit)

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

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)
