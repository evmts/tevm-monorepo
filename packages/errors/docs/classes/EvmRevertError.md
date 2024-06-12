[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / EvmRevertError

# Class: EvmRevertError

Represents an execution error that occurs when a transaction is reverted during EVM execution.
This error is typically encountered when a smart contract execution is reverted due to unmet conditions or failed assertions.

EvmRevert errors can occur due to:
- Failed assertions in the smart contract code.
- Conditions in the code that trigger a revert.
- Insufficient gas to complete the transaction.
- Contract logic that intentionally reverts under certain conditions.

To debug a revert error:
1. **Review Revert Conditions**: Ensure that the conditions in the contract code that trigger reverts are properly handled and expected.
2. **Check Assertions**: Verify that all assertions in the code are valid and necessary.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the revert occurs.
4. **Inspect Contract Logic**: Manually inspect the contract code to understand why the revert is being triggered and ensure it is intentional.

## Example

```typescript
import { EvmRevertError } from '@tevm/errors'
try {
  // Some operation that can throw a EvmRevertError
} catch (error) {
  if (error instanceof EvmRevertError) {
    console.error(error.message);
    // Handle the revert error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`RevertError`](RevertError.md)

## Constructors

### new EvmRevertError()

> **new EvmRevertError**(`message`?, `args`?): [`EvmRevertError`](EvmRevertError.md)

Constructs a EvmRevertError.
Represents an execution error that occurs when a transaction is reverted during EVM execution.
This error is typically encountered when a smart contract execution is reverted due to unmet conditions or failed assertions.

EvmRevert errors can occur due to:
- Failed assertions in the smart contract code.
- Conditions in the code that trigger a revert.
- Insufficient gas to complete the transaction.
- Contract logic that intentionally reverts under certain conditions.

To debug a revert error:
1. **Review Revert Conditions**: Ensure that the conditions in the contract code that trigger reverts are properly handled and expected.
2. **Check Assertions**: Verify that all assertions in the code are valid and necessary.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the revert occurs.
4. **Inspect Contract Logic**: Manually inspect the contract code to understand why the revert is being triggered and ensure it is intentional.

#### Parameters

• **message?**: `string`= `'Revert error occurred.'`

Human-readable error message.

• **args?**: [`EvmRevertErrorParameters`](../interfaces/EvmRevertErrorParameters.md)= `{}`

Additional parameters for the BaseError.

#### Returns

[`EvmRevertError`](EvmRevertError.md)

#### Overrides

[`RevertError`](RevertError.md).[`constructor`](RevertError.md#constructors)

#### Source

[packages/errors/src/ethereum/ethereumjs/EvmRevertError.js:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/EvmRevertError.js#L77)

## Properties

### \_tag

> **\_tag**: `string` = `'Revert'`

Same as name, used internally.

#### Inherited from

[`RevertError`](RevertError.md).[`_tag`](RevertError.md#_tag)

#### Source

[packages/errors/src/ethereum/RevertError.js:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/RevertError.js#L71)

***

### cause

> **cause**: `any`

#### Inherited from

[`RevertError`](RevertError.md).[`cause`](RevertError.md#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`RevertError`](RevertError.md).[`code`](RevertError.md#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`details`](RevertError.md#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`RevertError`](RevertError.md).[`docsPath`](RevertError.md#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`RevertError`](RevertError.md).[`message`](RevertError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`RevertError`](RevertError.md).[`meta`](RevertError.md#meta)

#### Source

[packages/errors/src/ethereum/RevertError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/RevertError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`RevertError`](RevertError.md).[`metaMessages`](RevertError.md#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string` = `'Revert'`

The name of the error, used to discriminate errors.

#### Inherited from

[`RevertError`](RevertError.md).[`name`](RevertError.md#name)

#### Source

[packages/errors/src/ethereum/RevertError.js:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/RevertError.js#L78)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`shortMessage`](RevertError.md#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`stack`](RevertError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`RevertError`](RevertError.md).[`version`](RevertError.md#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `ERROR` = `EVMErrorMessage.REVERT`

#### Source

[packages/errors/src/ethereum/ethereumjs/EvmRevertError.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/EvmRevertError.js#L56)

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

[`RevertError`](RevertError.md).[`prepareStackTrace`](RevertError.md#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`RevertError`](RevertError.md).[`stackTraceLimit`](RevertError.md#stacktracelimit)

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

[`RevertError`](RevertError.md).[`walk`](RevertError.md#walk)

#### Source

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

[`RevertError`](RevertError.md).[`captureStackTrace`](RevertError.md#capturestacktrace)

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

[`RevertError`](RevertError.md).[`captureStackTrace`](RevertError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
