[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidBytesSizeError

# Class: InvalidBytesSizeError

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

- [`InternalError`](InternalError.md)

## Constructors

### new InvalidBytesSizeError()

> **new InvalidBytesSizeError**(`size`, `expectedSize`, `message`?, `args`?): [`InvalidBytesSizeError`](InvalidBytesSizeError.md)

Constructs an InvalidBytesSizeError.

#### Parameters

• **size**: `number`

The actual size of the bytes.

• **expectedSize**: `number`

The expected size of the bytes.

• **message?**: `string`

Human-readable error message.

• **args?**: [`InvalidBytesSizeErrorParameters`](../type-aliases/InvalidBytesSizeErrorParameters.md)

Additional parameters for the BaseError.

#### Returns

[`InvalidBytesSizeError`](InvalidBytesSizeError.md)

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructors)

#### Source

packages/errors/types/data/InvalidByteSizeError.d.ts:51

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:47

***

### expectedSize

> **expectedSize**: `number`

The expected size of the bytes.

#### Source

packages/errors/types/data/InvalidByteSizeError.d.ts:59

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InternalError`](InternalError.md).[`message`](InternalError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

#### Source

packages/errors/types/ethereum/InternalErrorError.d.ts:48

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](InternalError.md).[`name`](InternalError.md#name)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:55

***

### size

> **size**: `number`

The actual size of the bytes.

#### Source

packages/errors/types/data/InvalidByteSizeError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`stack`](InternalError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:59

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

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InternalError`](InternalError.md).[`stackTraceLimit`](InternalError.md#stacktracelimit)

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

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:70

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613