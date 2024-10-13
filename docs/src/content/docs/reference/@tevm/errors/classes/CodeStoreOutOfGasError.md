---
editUrl: false
next: false
prev: false
title: "CodeStoreOutOfGasError"
---

Represents an error that occurs when a transaction runs out of gas during code storage.
This error is typically encountered when the gas provided for storing code is insufficient to complete its execution.
EVM transaction execution metadata level error

Code store out of gas errors can occur due to:
- Insufficient gas provided for storing large contracts.
- Incorrect estimation of gas required for storing code.
- Contracts with high gas consumption during the deployment phase.
- Non-deterministic gas usage during code storage.
- If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.

To debug a code store out of gas error:
1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient, especially for large contracts. If you provided explicit gas-related parameters, double-check their values.
2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption during deployment. Consider simplifying complex initialization code.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and inspect gas usage.
4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
5. **Use Other Tools**: Use other tools such as [Foundry](https://book.getfoundry.sh/forge/gas). If it works in Foundry, consider [opening a bug report](https://github.com/ethereumjs/ethereumjs-monorepo/issues).

## Example

```typescript
import { CodeStoreOutOfGasError } from '@tevm/errors'
try {
  // Some operation that can throw a CodeStoreOutOfGasError
} catch (error) {
  if (error instanceof CodeStoreOutOfGasError) {
    console.error(error.message);
    // Handle the code store out of gas error
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

### new CodeStoreOutOfGasError()

> **new CodeStoreOutOfGasError**(`message`?, `args`?, `tag`?): [`CodeStoreOutOfGasError`](/reference/tevm/errors/classes/codestoreoutofgaserror/)

Constructs a CodeStoreOutOfGasError.
Represents an error that occurs when a transaction runs out of gas during code storage.
This error is typically encountered when the gas provided for storing code is insufficient to complete its execution.
EVM transaction execution metadata level error

Code store out of gas errors can occur due to:
- Insufficient gas provided for storing large contracts.
- Incorrect estimation of gas required for storing code.
- Contracts with high gas consumption during the deployment phase.
- Non-deterministic gas usage during code storage.
- If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.

#### Parameters

• **message?**: `string` = `'Code store out of gas error occurred.'`

Human-readable error message.

• **args?**: [`CodeStoreOutOfGasErrorParameters`](/reference/tevm/errors/interfaces/codestoreoutofgaserrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'CodeStoreOutOfGasError'`

The tag for the error.

#### Returns

[`CodeStoreOutOfGasError`](/reference/tevm/errors/classes/codestoreoutofgaserror/)

#### Overrides

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`constructor`](/reference/tevm/errors/classes/gaslimitexceedederror/#constructors)

#### Defined in

[packages/errors/src/ethereum/ethereumjs/CodeStoreOutOfGasError.js:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeStoreOutOfGasError.js#L77)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`_tag`](/reference/tevm/errors/classes/gaslimitexceedederror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

***

### cause

> **cause**: `any`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`cause`](/reference/tevm/errors/classes/gaslimitexceedederror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`code`](/reference/tevm/errors/classes/gaslimitexceedederror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`details`](/reference/tevm/errors/classes/gaslimitexceedederror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`docsPath`](/reference/tevm/errors/classes/gaslimitexceedederror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`message`](/reference/tevm/errors/classes/gaslimitexceedederror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`metaMessages`](/reference/tevm/errors/classes/gaslimitexceedederror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`name`](/reference/tevm/errors/classes/gaslimitexceedederror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`shortMessage`](/reference/tevm/errors/classes/gaslimitexceedederror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`stack`](/reference/tevm/errors/classes/gaslimitexceedederror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`version`](/reference/tevm/errors/classes/gaslimitexceedederror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.CODESTORE_OUT_OF_GAS`

#### Defined in

[packages/errors/src/ethereum/ethereumjs/CodeStoreOutOfGasError.js:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/CodeStoreOutOfGasError.js#L59)

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

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`stackTraceLimit`](/reference/tevm/errors/classes/gaslimitexceedederror/#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:30

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

[`GasLimitExceededError`](/reference/tevm/errors/classes/gaslimitexceedederror/).[`captureStackTrace`](/reference/tevm/errors/classes/gaslimitexceedederror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630
