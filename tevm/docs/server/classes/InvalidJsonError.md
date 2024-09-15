[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [server](../README.md) / InvalidJsonError

# Class: InvalidJsonError

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

- [`BaseError`](../../errors/classes/BaseError.md)

## Constructors

### new InvalidJsonError()

> **new InvalidJsonError**(`message`, `args`?): [`InvalidJsonError`](InvalidJsonError.md)

Constructs an InvalidJsonError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidJsonErrorParameters`](../type-aliases/InvalidJsonErrorParameters.md)

Additional parameters for the InvalidJsonError.

#### Returns

[`InvalidJsonError`](InvalidJsonError.md)

#### Overrides

[`BaseError`](../../errors/classes/BaseError.md).[`constructor`](../../errors/classes/BaseError.md#constructors)

#### Defined in

packages/server/types/errors/InvalidJsonError.d.ts:44

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`_tag`](../../errors/classes/BaseError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`cause`](../../errors/classes/BaseError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`code`](../../errors/classes/BaseError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`details`](../../errors/classes/BaseError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`docsPath`](../../errors/classes/BaseError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:47

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`message`](../../errors/classes/BaseError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`metaMessages`](../../errors/classes/BaseError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`name`](../../errors/classes/BaseError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`shortMessage`](../../errors/classes/BaseError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`stack`](../../errors/classes/BaseError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`version`](../../errors/classes/BaseError.md#version)

#### Defined in

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

[`BaseError`](../../errors/classes/BaseError.md).[`prepareStackTrace`](../../errors/classes/BaseError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](../../errors/classes/BaseError.md).[`stackTraceLimit`](../../errors/classes/BaseError.md#stacktracelimit)

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

[`BaseError`](../../errors/classes/BaseError.md).[`walk`](../../errors/classes/BaseError.md#walk)

#### Defined in

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

[`BaseError`](../../errors/classes/BaseError.md).[`captureStackTrace`](../../errors/classes/BaseError.md#capturestacktrace)

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

[`BaseError`](../../errors/classes/BaseError.md).[`captureStackTrace`](../../errors/classes/BaseError.md#capturestacktrace)

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

[`BaseError`](../../errors/classes/BaseError.md).[`captureStackTrace`](../../errors/classes/BaseError.md#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67
