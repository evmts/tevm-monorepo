[**@tevm/server**](../README.md)

***

[@tevm/server](../globals.md) / InvalidJsonError

# Class: InvalidJsonError

Defined in: [packages/server/src/errors/InvalidJsonError.js:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/errors/InvalidJsonError.js#L40)

Represents an error that occurs when parsing JSON fails.

This error is typically encountered when there is an issue with the JSON structure, such as a syntax error or malformed JSON.

## Example

```ts
try {
  const data = parseJsonWithSomeTevmMethod(someString)
} catch (error) {
  if (error instanceof InvalidJsonError) {
    console.error(error.message);
    // Handle the invalid JSON error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidJsonError.

## Extends

- `BaseError`

## Constructors

### Constructor

> **new InvalidJsonError**(`message`, `args?`): `InvalidJsonError`

Defined in: [packages/server/src/errors/InvalidJsonError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/errors/InvalidJsonError.js#L47)

Constructs an InvalidJsonError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidJsonErrorParameters`](../interfaces/InvalidJsonErrorParameters.md) = `{}`

Additional parameters for the InvalidJsonError.

#### Returns

`InvalidJsonError`

#### Overrides

`BaseError.constructor`

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

`BaseError._tag`

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

The cause of the error.

#### Inherited from

`BaseError.cause`

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

Error code, analogous to the code in JSON RPC error.

#### Inherited from

`BaseError.code`

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

`BaseError.details`

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

`BaseError.docsPath`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

`BaseError.message`

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

`BaseError.metaMessages`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

`BaseError.name`

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

`BaseError.shortMessage`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`BaseError.stack`

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

`BaseError.version`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:960

The maximum number of stack frames to capture.

#### Inherited from

`BaseError.stackTraceLimit`

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

`BaseError.walk`

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

`BaseError.captureStackTrace`

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

`BaseError.captureStackTrace`

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

`BaseError.isError`

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

`BaseError.prepareStackTrace`
