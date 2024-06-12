[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / AccountNotFoundError

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

> **new AccountNotFoundError**(`message`, `args`?): [`AccountNotFoundError`](AccountNotFoundError.md)

Constructs an AccountNotFoundError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: `AccountNotFoundErrorParameters`= `{}`

Additional parameters for the ResourceNotFoundError.

#### Returns

[`AccountNotFoundError`](AccountNotFoundError.md)

#### Overrides

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`constructor`](ResourceNotFoundError.md#constructors)

#### Source

[packages/errors/src/ethereum/AccountNotFoundError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/AccountNotFoundError.js#L47)

## Properties

### \_tag

> **\_tag**: `"ResourceNotFound"` = `'ResourceNotFound'`

Same as name, used internally.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`_tag`](ResourceNotFoundError.md#_tag)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`cause`](ResourceNotFoundError.md#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L115)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`code`](ResourceNotFoundError.md#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### details

> **details**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`details`](ResourceNotFoundError.md#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L92)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`docsPath`](ResourceNotFoundError.md#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L97)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`message`](ResourceNotFoundError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`meta`](ResourceNotFoundError.md#meta)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`metaMessages`](ResourceNotFoundError.md#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L101)

***

### name

> **name**: `"ResourceNotFound"` = `'ResourceNotFound'`

The name of the error, used to discriminate errors.

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`name`](ResourceNotFoundError.md#name)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`shortMessage`](ResourceNotFoundError.md#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L105)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stack`](ResourceNotFoundError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`version`](ResourceNotFoundError.md#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L109)

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

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`stackTraceLimit`](ResourceNotFoundError.md#stacktracelimit)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`walk`](ResourceNotFoundError.md#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L138)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`captureStackTrace`](ResourceNotFoundError.md#capturestacktrace)

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

[`ResourceNotFoundError`](ResourceNotFoundError.md).[`captureStackTrace`](ResourceNotFoundError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
