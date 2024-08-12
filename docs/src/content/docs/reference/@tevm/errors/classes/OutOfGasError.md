---
editUrl: false
next: false
prev: false
title: "OutOfGasError"
---

Represents an execution error that occurs when a transaction runs out of gas during execution.
This error is typically encountered when the gas provided for a transaction is insufficient to complete its execution.

Out of gas errors can occur due to:
- Insufficient gas provided for complex transactions or loops.
- Incorrect estimation of gas required for certain operations.
- Contracts with high gas consumption in specific functions.
- Non-deterministic gas usage in contracts.
- If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.

To debug an out of gas error:
1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient. If you provided explicit gas-related parameters, double-check their values.
2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption, especially in loops and complex operations. Remove potential non-deterministic behaviors.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect gas usage.
4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
5. **Use Other Tools**: Use other tools with gas profiling such as [Foundry](https://book.getfoundry.sh/forge/gas).

## Example

```typescript
try {
  // Some operation that can throw an OutOfGasError
} catch (error) {
  if (error instanceof OutOfGasError) {
    console.error(error.message);
    // Handle the out of gas error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/)

## Constructors

### new OutOfGasError()

> **new OutOfGasError**(`message`?, `args`?, `tag`?): [`OutOfGasError`](/reference/tevm/errors/classes/outofgaserror/)

Constructs an OutOfGasError.
Represents an execution error that occurs when a transaction runs out of gas during execution.
This error is typically encountered when the gas provided for a transaction is insufficient to complete its execution.

Out of gas errors can occur due to:
- Insufficient gas provided for complex transactions or loops.
- Incorrect estimation of gas required for certain operations.
- Contracts with high gas consumption in specific functions.
- Non-deterministic gas usage in contracts.
- If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.

To debug an out of gas error:
1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient. If you provided explicit gas-related parameters, double-check their values.
2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption, especially in loops and complex operations. Remove potential non-deterministic behaviors.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect gas usage.
4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
5. **Use Other Tools**: Use other tools with gas profiling such as [Foundry](https://book.getfoundry.sh/forge/gas).

#### Parameters

• **message?**: `string` = `'Out of gas error occurred.'`

Human-readable error message.

• **args?**: [`OutOfGasErrorParameters`](/reference/tevm/errors/interfaces/outofgaserrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'OutOfGasError'`

The tag for the error.

#### Returns

[`OutOfGasError`](/reference/tevm/errors/classes/outofgaserror/)

#### Overrides

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`constructor`](/reference/tevm/errors/classes/gaslimitexceedederror/#constructors)

#### Defined in

[packages/errors/src/ethereum/ethereumjs/OutOfGasError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/OutOfGasError.js#L81)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`_tag`](/reference/tevm/errors/classes/gaslimitexceedederror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`cause`](/reference/tevm/errors/classes/gaslimitexceedederror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`code`](/reference/tevm/errors/classes/gaslimitexceedederror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`details`](/reference/tevm/errors/classes/gaslimitexceedederror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`docsPath`](/reference/tevm/errors/classes/gaslimitexceedederror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`message`](/reference/tevm/errors/classes/gaslimitexceedederror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`metaMessages`](/reference/tevm/errors/classes/gaslimitexceedederror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`name`](/reference/tevm/errors/classes/gaslimitexceedederror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`shortMessage`](/reference/tevm/errors/classes/gaslimitexceedederror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`stack`](/reference/tevm/errors/classes/gaslimitexceedederror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`version`](/reference/tevm/errors/classes/gaslimitexceedederror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.OUT_OF_GAS`

#### Defined in

[packages/errors/src/ethereum/ethereumjs/OutOfGasError.js:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/OutOfGasError.js#L57)

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

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`prepareStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`stackTraceLimit`](/reference/tevm/errors/classes/gaslimitexceedederror/#stacktracelimit)

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

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`walk`](/reference/tevm/errors/classes/gaslimitexceedederror/#walk)

#### Defined in

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

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`captureStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#capturestacktrace)

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

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`captureStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.2.0/node\_modules/@types/node/globals.d.ts:22

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`captureStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`captureStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.22/node\_modules/bun-types/globals.d.ts:1629
