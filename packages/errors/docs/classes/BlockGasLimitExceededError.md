[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BlockGasLimitExceededError

# Class: BlockGasLimitExceededError

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L47)

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

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L61)

Constructs a BlockGasLimitExceededError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`BlockGasLimitExceededErrorParameters`](../interfaces/BlockGasLimitExceededErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'BlockGasLimitExceededError'`

The tag for the error.

#### Returns

[`BlockGasLimitExceededError`](BlockGasLimitExceededError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

## Properties

### \_tag

> **\_tag**: `"BlockGasLimitExceeded"` = `'BlockGasLimitExceeded'`

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L83)

Same as name, used internally.

#### Overrides

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag-1)

***

### cause

> **cause**: `any`

Defined in: [packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

***

### code

> **code**: `number`

Defined in: [packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code-1)

***

### details

> **details**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

***

### meta

> **meta**: `undefined` \| `object`

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L76)

Optional object containing additional information about the error.

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: [packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### name

> **name**: `"BlockGasLimitExceeded"` = `'BlockGasLimitExceeded'`

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L89)

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage-1)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

***

### version

> **version**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

***

### code

> `static` **code**: `number` = `-32006`

Defined in: [packages/errors/src/ethereum/BlockGasLimitExceededError.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BlockGasLimitExceededError.js#L52)

Error code (-32006), a non-standard extension for this specific error.

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:143

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

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Defined in: [packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

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

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.4/node\_modules/bun-types/globals.d.ts:1632

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)
