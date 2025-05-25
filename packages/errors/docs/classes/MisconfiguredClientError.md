[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / MisconfiguredClientError

# Class: MisconfiguredClientError

Defined in: packages/errors/src/client/MisconfiguredClient.js:48

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

- [`InternalError`](InternalError.md)

## Constructors

### Constructor

> **new MisconfiguredClientError**(`message?`, `args?`): `MisconfiguredClientError`

Defined in: packages/errors/src/client/MisconfiguredClient.js:55

Constructs a MisconfiguredClientError.

#### Parameters

##### message?

`string` = `'Misconfigured client error occurred.'`

Human-readable error message.

##### args?

[`MisconfiguredClientErrorParameters`](../interfaces/MisconfiguredClientErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`MisconfiguredClientError`

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/src/ethereum/InternalErrorError.js:74

Same as name, used internally.

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/src/ethereum/BaseError.js:114

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/src/ethereum/BaseError.js:112

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:91

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/src/ethereum/BaseError.js:96

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`InternalError`](InternalError.md).[`message`](InternalError.md#message)

***

### meta

> **meta**: `undefined` \| `object`

Defined in: packages/errors/src/ethereum/InternalErrorError.js:75

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/src/ethereum/BaseError.js:100

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

***

### name

> **name**: `string`

Defined in: packages/errors/src/ethereum/InternalErrorError.js:73

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](InternalError.md).[`name`](InternalError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:104

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`InternalError`](InternalError.md).[`stack`](InternalError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:108

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

***

### code

> `static` **code**: `number` = `-32603`

Defined in: packages/errors/src/ethereum/InternalErrorError.js:52

The error code for InternalError.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code-1)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:960

The maximum number of stack frames to capture.

#### Inherited from

[`InternalError`](InternalError.md).[`stackTraceLimit`](InternalError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Defined in: packages/errors/src/ethereum/BaseError.js:137

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:955

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

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:145

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

***

### isError()

> `static` **isError**(`value`): `value is Error`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:950

Check if a value is an instance of Error

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

#### Inherited from

[`InternalError`](InternalError.md).[`isError`](InternalError.md#iserror)

***

### prepareStackTrace()

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:149

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
