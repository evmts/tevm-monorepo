[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / AccountNotFoundError

# Class: AccountNotFoundError

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

### new AccountNotFoundError()

> **new AccountNotFoundError**(`message`, `args`?, `tag`?): [`AccountNotFoundError`](AccountNotFoundError.md)

Constructs a ResourceNotFoundError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`ResourceNotFoundErrorParameters`](../type-aliases/ResourceNotFoundErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`AccountNotFoundError`](AccountNotFoundError.md)

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`constructor`](ResourceNotFoundError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ResourceNotFoundError.d.ts:45

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`_tag`](ResourceNotFoundError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`cause`](ResourceNotFoundError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`details`](ResourceNotFoundError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`docsPath`](ResourceNotFoundError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:47

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`message`](ResourceNotFoundError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`metaMessages`](ResourceNotFoundError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`name`](ResourceNotFoundError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`shortMessage`](ResourceNotFoundError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stack`](ResourceNotFoundError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`version`](ResourceNotFoundError.md#version)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`prepareStackTrace`](ResourceNotFoundError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stackTraceLimit`](ResourceNotFoundError.md#stacktracelimit)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`walk`](ResourceNotFoundError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:70

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`captureStackTrace`](ResourceNotFoundError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21
