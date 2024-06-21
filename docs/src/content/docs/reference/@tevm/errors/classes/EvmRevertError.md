---
editUrl: false
next: false
prev: false
title: "EvmRevertError"
---

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

- [`RevertError`](/reference/tevm/errors/classes/reverterror/)

## Constructors

### new EvmRevertError()

> **new EvmRevertError**(`message`?, `args`?, `tag`?): [`EvmRevertError`](/reference/tevm/errors/classes/evmreverterror/)

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

• **args?**: [`EvmRevertErrorParameters`](/reference/tevm/errors/interfaces/evmreverterrorparameters/)= `{}`

Additional parameters for the BaseError.

• **tag?**: `string`= `'EvmRevertError'`

The tag for the error.

#### Returns

[`EvmRevertError`](/reference/tevm/errors/classes/evmreverterror/)

#### Overrides

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`constructor`](/reference/tevm/errors/classes/reverterror/#constructors)

#### Source

[packages/errors/src/ethereum/ethereumjs/EvmRevertError.js:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/EvmRevertError.js#L78)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`_tag`](/reference/tevm/errors/classes/reverterror/#_tag)

#### Source

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`cause`](/reference/tevm/errors/classes/reverterror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`code`](/reference/tevm/errors/classes/reverterror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`details`](/reference/tevm/errors/classes/reverterror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`docsPath`](/reference/tevm/errors/classes/reverterror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`message`](/reference/tevm/errors/classes/reverterror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`metaMessages`](/reference/tevm/errors/classes/reverterror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`name`](/reference/tevm/errors/classes/reverterror/#name)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`shortMessage`](/reference/tevm/errors/classes/reverterror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`stack`](/reference/tevm/errors/classes/reverterror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`version`](/reference/tevm/errors/classes/reverterror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.REVERT`

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

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`prepareStackTrace`](/reference/tevm/errors/classes/reverterror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`stackTraceLimit`](/reference/tevm/errors/classes/reverterror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:30

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

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`walk`](/reference/tevm/errors/classes/reverterror/#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L136)

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

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`captureStackTrace`](/reference/tevm/errors/classes/reverterror/#capturestacktrace)

##### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`RevertError`](/reference/tevm/errors/classes/reverterror/).[`captureStackTrace`](/reference/tevm/errors/classes/reverterror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.13/node\_modules/bun-types/globals.d.ts:1613
