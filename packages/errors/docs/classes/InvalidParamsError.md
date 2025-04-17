[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidParamsError

# Class: InvalidParamsError

Defined in: [packages/errors/src/ethereum/InvalidParamsError.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L41)

Represents an error that occurs when invalid method parameters are provided.

This error is typically encountered when a JSON-RPC request is made with parameters that are not valid or do not match the expected types.

## Example

```ts
try {
  // Some operation that can throw an InvalidParamsError
} catch (error) {
  if (error instanceof InvalidParamsError) {
    console.error(error.message);
    // Handle the invalid params error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Extended by

- [`InvalidToError`](InvalidToError.md)
- [`InvalidAbiError`](InvalidAbiError.md)
- [`InvalidUrlError`](InvalidUrlError.md)
- [`InvalidArgsError`](InvalidArgsError.md)
- [`InvalidDataError`](InvalidDataError.md)
- [`InvalidSaltError`](InvalidSaltError.md)
- [`InvalidBlockError`](InvalidBlockError.md)
- [`InvalidDepthError`](InvalidDepthError.md)
- [`InvalidNonceError`](InvalidNonceError.md)
- [`InvalidValueError`](InvalidValueError.md)
- [`InvalidCallerError`](InvalidCallerError.md)
- [`InvalidOriginError`](InvalidOriginError.md)
- [`InvalidBalanceError`](InvalidBalanceError.md)
- [`InvalidBytecodeError`](InvalidBytecodeError.md)
- [`InvalidGasLimitError`](InvalidGasLimitError.md)
- [`InvalidGasRefundError`](InvalidGasRefundError.md)
- [`InvalidSkipBalanceError`](InvalidSkipBalanceError.md)
- [`InvalidStorageRootError`](InvalidStorageRootError.md)
- [`InvalidFunctionNameError`](InvalidFunctionNameError.md)
- [`InvalidSelfdestructError`](InvalidSelfdestructError.md)
- [`InvalidDeployedBytecodeError`](InvalidDeployedBytecodeError.md)
- [`InvalidBlobVersionedHashesError`](InvalidBlobVersionedHashesError.md)
- [`InvalidMaxFeePerGasError`](InvalidMaxFeePerGasError.md)
- [`InvalidMaxPriorityFeePerGasError`](InvalidMaxPriorityFeePerGasError.md)
- [`InvalidAddToMempoolError`](InvalidAddToMempoolError.md)
- [`InvalidAddToBlockchainError`](InvalidAddToBlockchainError.md)
- [`DecodeFunctionDataError`](DecodeFunctionDataError.md)
- [`EncodeFunctionReturnDataError`](EncodeFunctionReturnDataError.md)

## Constructors

### new InvalidParamsError()

> **new InvalidParamsError**(`message`, `args`?, `tag`?): [`InvalidParamsError`](InvalidParamsError.md)

Defined in: [packages/errors/src/ethereum/InvalidParamsError.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L55)

Constructs an InvalidParamsError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidParamsErrorParameters`](../interfaces/InvalidParamsErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidParams'`

The tag for the error.

#### Returns

[`InvalidParamsError`](InvalidParamsError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

Same as name, used internally.

#### Inherited from

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

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: [packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

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

> `static` **code**: `number` = `-32602`

Defined in: [packages/errors/src/ethereum/InvalidParamsError.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L46)

Error code, analogous to the code in JSON RPC error.

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:143

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

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

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

Defined in: node\_modules/.pnpm/bun-types@1.2.5/node\_modules/bun-types/globals.d.ts:1441

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
