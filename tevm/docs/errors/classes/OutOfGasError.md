[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / OutOfGasError

# Class: OutOfGasError

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

- [`GasLimitExceededError`](GasLimitExceededError.md)

## Constructors

### new OutOfGasError()

> **new OutOfGasError**(`message`?, `args`?, `tag`?): [`OutOfGasError`](OutOfGasError.md)

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

• **message?**: `string`

Human-readable error message.

• **args?**: [`OutOfGasErrorParameters`](../type-aliases/OutOfGasErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`OutOfGasError`](OutOfGasError.md)

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ethereumjs/OutOfGasError.d.ts:77

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:47

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`message`](GasLimitExceededError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`name`](GasLimitExceededError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stack`](GasLimitExceededError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:59

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](../../evm/enumerations/EvmErrorMessage.md)

#### Defined in

packages/errors/types/ethereum/ethereumjs/OutOfGasError.d.ts:53

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

[`GasLimitExceededError`](GasLimitExceededError.md).[`prepareStackTrace`](GasLimitExceededError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`stackTraceLimit`](GasLimitExceededError.md#stacktracelimit)

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

[`GasLimitExceededError`](GasLimitExceededError.md).[`walk`](GasLimitExceededError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:70

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

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21
