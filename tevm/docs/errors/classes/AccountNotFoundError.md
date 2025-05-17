[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / AccountNotFoundError

# Class: AccountNotFoundError

Defined in: packages/errors/types/ethereum/AccountNotFoundError.d.ts:37

Represents an error that occurs when an account cannot be found in the state.

This error is typically encountered when a transaction or operation references an account that does not exist in the blockchain state.

## Example

```ts
try {
  // Some operation that can throw an AccountNotFoundError
} catch (error) {
  if (error instanceof AccountNotFoundError) {
    console.error(error.message);
    // Handle the account not found error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the ResourceNotFoundError.

## Extends

- [`ResourceNotFoundError`](ResourceNotFoundError.md)

## Constructors

### Constructor

> **new AccountNotFoundError**(`message`, `args?`, `tag?`): `AccountNotFoundError`

Defined in: packages/errors/types/ethereum/ResourceNotFoundError.d.ts:45

Constructs a ResourceNotFoundError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ResourceNotFoundErrorParameters`](../type-aliases/ResourceNotFoundErrorParameters.md)

Additional parameters for the BaseError.

##### tag?

`string`

The tag for the error.

#### Returns

`AccountNotFoundError`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`constructor`](ResourceNotFoundError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`_tag`](ResourceNotFoundError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`cause`](ResourceNotFoundError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`details`](ResourceNotFoundError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`docsPath`](ResourceNotFoundError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`message`](ResourceNotFoundError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`metaMessages`](ResourceNotFoundError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`name`](ResourceNotFoundError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`shortMessage`](ResourceNotFoundError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stack`](ResourceNotFoundError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`version`](ResourceNotFoundError.md#version)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`prepareStackTrace`](ResourceNotFoundError.md#preparestacktrace)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stackTraceLimit`](ResourceNotFoundError.md#stacktracelimit)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`walk`](ResourceNotFoundError.md#walk)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`captureStackTrace`](ResourceNotFoundError.md#capturestacktrace)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`captureStackTrace`](ResourceNotFoundError.md#capturestacktrace)
