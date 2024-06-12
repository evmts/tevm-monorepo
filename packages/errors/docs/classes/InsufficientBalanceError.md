[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / InsufficientBalanceError

# Class: InsufficientBalanceError

Represents an error that occurs when an account has insufficient balance to perform a transaction.

Insufficient balance errors can occur due to:
- Attempting to transfer or spend more funds than available in the account.

To debug an insufficient balance error:
1. **Review Account Balance**: Ensure that the account has sufficient funds to cover the transaction.
2. **Check Transaction Details**: Verify the transaction amount and ensure it does not exceed the account balance.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction execution and identify where the insufficient balance occurs.

## Example

```typescript
import { InsufficientBalanceError } from '@tevm/errors'
try {
  // Some operation that can throw an InsufficientBalanceError
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error(error.message);
    // Handle the insufficient balance error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`ExecutionError`](ExecutionError.md)

## Constructors

### new InsufficientBalanceError()

> **new InsufficientBalanceError**(`message`?, `args`?): [`InsufficientBalanceError`](InsufficientBalanceError.md)

Constructs an InsufficientBalanceError.

#### Parameters

• **message?**: `string`= `'Insufficient balance error occurred.'`

Human-readable error message.

• **args?**: [`InsufficientBalanceErrorParameters`](../interfaces/InsufficientBalanceErrorParameters.md)= `{}`

Additional parameters for the BaseError.

#### Returns

[`InsufficientBalanceError`](InsufficientBalanceError.md)

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructors)

#### Source

[packages/errors/src/ethereum/ethereumjs/InsufficientBalanceError.js:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/InsufficientBalanceError.js#L58)

## Properties

### \_tag

> **\_tag**: `string` = `'ExecutionError'`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L76)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L115)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L92)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L97)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`message`](ExecutionError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`meta`](ExecutionError.md#meta)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L69)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L101)

***

### name

> **name**: `"ExecutionError"` = `'ExecutionError'`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`name`](ExecutionError.md#name)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L82)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L105)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stack`](ExecutionError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L109)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `ERROR` = `EVMErrorMessage.INSUFFICIENT_BALANCE`

#### Source

[packages/errors/src/ethereum/ethereumjs/InsufficientBalanceError.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/InsufficientBalanceError.js#L51)

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

[`ExecutionError`](ExecutionError.md).[`prepareStackTrace`](ExecutionError.md#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

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

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
