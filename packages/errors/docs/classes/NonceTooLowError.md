[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / NonceTooLowError

# Class: NonceTooLowError

Represents an error that occurs when the nonce value is too low.

This error is typically encountered when a transaction is attempted with a nonce that is lower than the next expected nonce.

## Example

```ts
try {
  // Some operation that can throw a NonceTooLowError
} catch (error) {
  if (error instanceof NonceTooLowError) {
    console.error(error.message);
    // Handle the nonce too low error
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

### new NonceTooLowError()

> **new NonceTooLowError**(`message`, `args`?): [`NonceTooLowError`](NonceTooLowError.md)

Constructs a NonceTooLowError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`NonceTooLowErrorParameters`](../interfaces/NonceTooLowErrorParameters.md)= `{}`

Additional parameters for the BaseError.

#### Returns

[`NonceTooLowError`](NonceTooLowError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

#### Source

[packages/errors/src/ethereum/NonceTooLowError.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/NonceTooLowError.js#L48)

## Properties

### \_tag

> **\_tag**: `"NonceTooLow"` = `'NonceTooLow'`

Same as name, used internally.

#### Overrides

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

#### Source

[packages/errors/src/ethereum/NonceTooLowError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/NonceTooLowError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L110)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L87)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L92)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Source

[packages/errors/src/ethereum/NonceTooLowError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/NonceTooLowError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### name

> **name**: `"NonceTooLow"` = `'NonceTooLow'`

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

#### Source

[packages/errors/src/ethereum/NonceTooLowError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/NonceTooLowError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

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

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L133)

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

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

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

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
