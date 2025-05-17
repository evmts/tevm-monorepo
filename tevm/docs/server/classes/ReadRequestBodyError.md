[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [server](../README.md) / ReadRequestBodyError

# Class: ReadRequestBodyError

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:26

Represents an error that occurs when reading the request body from an HTTP request fails.

This error is typically encountered when there is an issue with reading the request body, such as a network error or a problem with the incoming request stream.

## Param

A human-readable error message.

## Param

Additional parameters for the ReadRequestBodyError.

## Extends

- [`BaseError`](../../errors/classes/BaseError.md)

## Constructors

### Constructor

> **new ReadRequestBodyError**(`message`, `args?`): `ReadRequestBodyError`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:33

Constructs a ReadRequestBodyError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ReadRequestBodyErrorParameters`](../type-aliases/ReadRequestBodyErrorParameters.md)

Additional parameters for the ReadRequestBodyError.

#### Returns

`ReadRequestBodyError`

#### Overrides

[`BaseError`](../../errors/classes/BaseError.md).[`constructor`](../../errors/classes/BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`_tag`](../../errors/classes/BaseError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`cause`](../../errors/classes/BaseError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`code`](../../errors/classes/BaseError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`details`](../../errors/classes/BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`docsPath`](../../errors/classes/BaseError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`message`](../../errors/classes/BaseError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`metaMessages`](../../errors/classes/BaseError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`name`](../../errors/classes/BaseError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`shortMessage`](../../errors/classes/BaseError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`stack`](../../errors/classes/BaseError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`version`](../../errors/classes/BaseError.md#version)

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

[`BaseError`](../../errors/classes/BaseError.md).[`prepareStackTrace`](../../errors/classes/BaseError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`stackTraceLimit`](../../errors/classes/BaseError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

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

[`BaseError`](../../errors/classes/BaseError.md).[`walk`](../../errors/classes/BaseError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

[`BaseError`](../../errors/classes/BaseError.md).[`captureStackTrace`](../../errors/classes/BaseError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.18/node\_modules/@types/node/globals.d.ts:145

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

[`BaseError`](../../errors/classes/BaseError.md).[`captureStackTrace`](../../errors/classes/BaseError.md#capturestacktrace)
