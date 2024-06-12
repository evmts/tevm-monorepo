[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidParamsError

# Class: InvalidParamsError

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
- [`DecodeFunctionDataError`](DecodeFunctionDataError.md)
- [`EncodeFunctionReturnDataError`](EncodeFunctionReturnDataError.md)

## Constructors

### new InvalidParamsError()

> **new InvalidParamsError**(`message`, `args`?): [`InvalidParamsError`](InvalidParamsError.md)

Constructs an InvalidParamsError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidParamsErrorParameters`](../type-aliases/InvalidParamsErrorParameters.md)

Additional parameters for the BaseError.

#### Returns

[`InvalidParamsError`](InvalidParamsError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

#### Source

packages/errors/types/ethereum/InvalidParamsError.d.ts:44

## Properties

### \_tag

> **\_tag**: `"InvalidParams"`

Same as name, used internally.

#### Overrides

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

#### Source

packages/errors/types/ethereum/InvalidParamsError.d.ts:53

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:47

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

packages/errors/types/ethereum/InvalidParamsError.d.ts:48

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `"InvalidParams"`

The name of the error, used to discriminate errors.

#### Overrides

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

#### Source

packages/errors/types/ethereum/InvalidParamsError.d.ts:58

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

#### Source

packages/errors/types/ethereum/BaseError.d.ts:55

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

packages/errors/types/ethereum/BaseError.d.ts:59

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

packages/errors/types/ethereum/BaseError.d.ts:70

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
