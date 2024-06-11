[**@tevm/errors**](../README.md) • **Docs**

***

[@tevm/errors](../globals.md) / InvalidBlobVersionedHashesError

# Class: InvalidBlobVersionedHashesError

Represents an error that occurs when the blobVersionedHashes parameter is invalid.

This error is typically encountered when a transaction or operation references a blobVersionedHashes parameter that is malformed or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidBlobVersionedHashesError
} catch (error) {
  if (error instanceof InvalidBlobVersionedHashesError) {
    console.error(error.message);
    // Handle the invalid blobVersionedHashes error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidParamsError.

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### new InvalidBlobVersionedHashesError()

> **new InvalidBlobVersionedHashesError**(`message`, `args`?): [`InvalidBlobVersionedHashesError`](InvalidBlobVersionedHashesError.md)

Constructs an InvalidBlobVersionedHashesError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidBlobVersionedHashesErrorParameters`](../interfaces/InvalidBlobVersionedHashesErrorParameters.md)= `{}`

Additional parameters for the InvalidParamsError.

#### Returns

[`InvalidBlobVersionedHashesError`](InvalidBlobVersionedHashesError.md)

#### Overrides

[`InvalidParamsError`](InvalidParamsError.md).[`constructor`](InvalidParamsError.md#constructors)

#### Source

[packages/errors/src/input/InvalidBlobVersionedHashesError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidBlobVersionedHashesError.js#L47)

## Properties

### \_tag

> **\_tag**: `"InvalidParams"` = `'InvalidParams'`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`_tag`](InvalidParamsError.md#_tag)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`cause`](InvalidParamsError.md#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L110)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`details`](InvalidParamsError.md#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L87)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`docsPath`](InvalidParamsError.md#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L92)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`message`](InvalidParamsError.md#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`meta`](InvalidParamsError.md#meta)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`metaMessages`](InvalidParamsError.md#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### name

> **name**: `"InvalidParams"` = `'InvalidParams'`

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`name`](InvalidParamsError.md#name)

#### Source

[packages/errors/src/ethereum/InvalidParamsError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`shortMessage`](InvalidParamsError.md#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`stack`](InvalidParamsError.md#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`version`](InvalidParamsError.md#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

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

[`InvalidParamsError`](InvalidParamsError.md).[`prepareStackTrace`](InvalidParamsError.md#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.2/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`stackTraceLimit`](InvalidParamsError.md#stacktracelimit)

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

[`InvalidParamsError`](InvalidParamsError.md).[`walk`](InvalidParamsError.md#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L133)

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

[`InvalidParamsError`](InvalidParamsError.md).[`captureStackTrace`](InvalidParamsError.md#capturestacktrace)

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

[`InvalidParamsError`](InvalidParamsError.md).[`captureStackTrace`](InvalidParamsError.md#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.12/node\_modules/bun-types/globals.d.ts:1613
