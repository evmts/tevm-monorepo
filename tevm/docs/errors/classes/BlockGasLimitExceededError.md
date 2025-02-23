[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / BlockGasLimitExceededError

# Class: BlockGasLimitExceededError

Represents an error that occurs when the block gas limit has been exceeded.

This error is typically encountered when a transaction or set of transactions in a block
consume more gas than the block's gas limit allows. Each block in Ethereum has a maximum
amount of gas that can be used by all transactions within it.

The error code -32006 is a non-standard extension used by some Ethereum clients to
indicate this specific condition.

## Example

```ts
try {
  const result = await client.sendTransaction({
    // ... transaction details
  })
} catch (error) {
  if (error instanceof BlockGasLimitExceededError) {
    console.error('Block gas limit exceeded:', error.message);
    console.log('Consider splitting the transaction or waiting for a block with more available gas');
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### new BlockGasLimitExceededError()

> **new BlockGasLimitExceededError**(`message`, `args`?, `tag`?): [`BlockGasLimitExceededError`](BlockGasLimitExceededError.md)

Constructs a BlockGasLimitExceededError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`BlockGasLimitExceededErrorParameters`](../type-aliases/BlockGasLimitExceededErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`BlockGasLimitExceededError`](BlockGasLimitExceededError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

#### Defined in

packages/errors/types/ethereum/BlockGasLimitExceededError.d.ts:57

## Properties

### \_tag

> **\_tag**: `"BlockGasLimitExceeded"`

Same as name, used internally.

#### Overrides

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BlockGasLimitExceededError.d.ts:66

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Defined in

packages/errors/types/ethereum/BlockGasLimitExceededError.d.ts:61

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `"BlockGasLimitExceeded"`

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

#### Defined in

packages/errors/types/ethereum/BlockGasLimitExceededError.d.ts:71

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

***

### code

> `static` **code**: `number`

Error code (-32006), a non-standard extension for this specific error.

#### Defined in

packages/errors/types/ethereum/BlockGasLimitExceededError.d.ts:49

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:71

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

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
