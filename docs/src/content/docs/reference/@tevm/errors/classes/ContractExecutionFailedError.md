---
editUrl: false
next: false
prev: false
title: "ContractExecutionFailedError"
---

Represents an error that occurs when the execution of a smart contract fails.

This error is typically encountered when a smart contract's execution reverts or
encounters an exception during its operation. It can be due to various reasons such as
failing assertions, out-of-gas errors, or other contract-specific logic failures.

The error code -32004 is a non-standard extension used by some Ethereum clients to
indicate a contract execution failure.

## Example

```ts
try {
  const result = await client.call({
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    data: '0x...' // encoded function call
  })
} catch (error) {
  if (error instanceof ContractExecutionFailedError) {
    console.error('Contract execution failed:', error.message);
    console.log('Check the contract logic or input parameters');
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](/reference/tevm/errors/classes/baseerror/)

## Constructors

### new ContractExecutionFailedError()

> **new ContractExecutionFailedError**(`message`, `args`?, `tag`?): [`ContractExecutionFailedError`](/reference/tevm/errors/classes/contractexecutionfailederror/)

Constructs a ContractExecutionFailedError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`ContractExecutionFailedErrorParameters`](/reference/tevm/errors/interfaces/contractexecutionfailederrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'ContractExecutionFailed'`

The tag for the error.

#### Returns

[`ContractExecutionFailedError`](/reference/tevm/errors/classes/contractexecutionfailederror/)

#### Overrides

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`constructor`](/reference/tevm/errors/classes/baseerror/#constructors)

#### Defined in

[packages/errors/src/ethereum/ContractExecutionFailedError.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ContractExecutionFailedError.js#L62)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`_tag`](/reference/tevm/errors/classes/baseerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/ContractExecutionFailedError.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ContractExecutionFailedError.js#L75)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`cause`](/reference/tevm/errors/classes/baseerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`code`](/reference/tevm/errors/classes/baseerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`details`](/reference/tevm/errors/classes/baseerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`docsPath`](/reference/tevm/errors/classes/baseerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`message`](/reference/tevm/errors/classes/baseerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`metaMessages`](/reference/tevm/errors/classes/baseerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`name`](/reference/tevm/errors/classes/baseerror/#name)

#### Defined in

[packages/errors/src/ethereum/ContractExecutionFailedError.js:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ContractExecutionFailedError.js#L74)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`shortMessage`](/reference/tevm/errors/classes/baseerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stack`](/reference/tevm/errors/classes/baseerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`version`](/reference/tevm/errors/classes/baseerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### code

> `static` **code**: `number` = `-32004`

Error code (-32004), a non-standard extension for this specific error.

#### Defined in

[packages/errors/src/ethereum/ContractExecutionFailedError.js:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ContractExecutionFailedError.js#L53)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/baseerror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/baseerror/#stacktracelimit)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`walk`](/reference/tevm/errors/classes/baseerror/#walk)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

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

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`BaseError`](/reference/tevm/errors/classes/baseerror/).[`captureStackTrace`](/reference/tevm/errors/classes/baseerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
