---
editUrl: false
next: false
prev: false
title: "InvalidOriginError"
---

Represents an error that occurs when the origin parameter is invalid.

This error is typically encountered when a transaction or operation references an origin parameter that is invalid or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidOriginError
} catch (error) {
  if (error instanceof InvalidOriginError) {
    console.error(error.message);
    // Handle the invalid origin error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidOriginError.

## Extends

- [`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/)

## Constructors

### new InvalidOriginError()

> **new InvalidOriginError**(`message`, `args`?, `tag`?): [`InvalidOriginError`](/reference/tevm/errors/classes/invalidoriginerror/)

Constructs an InvalidOriginError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidOriginErrorParameters`](/reference/tevm/errors/interfaces/invalidoriginerrorparameters/) = `{}`

Additional parameters for the InvalidOriginError.

• **tag?**: `string` = `'InvalidOriginError'`

The tag for the error.

#### Returns

[`InvalidOriginError`](/reference/tevm/errors/classes/invalidoriginerror/)

#### Overrides

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`constructor`](/reference/tevm/errors/classes/invalidparamserror/#constructors)

#### Defined in

[packages/errors/src/input/InvalidOriginError.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidOriginError.js#L48)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`_tag`](/reference/tevm/errors/classes/invalidparamserror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`cause`](/reference/tevm/errors/classes/invalidparamserror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`code`](/reference/tevm/errors/classes/invalidparamserror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`details`](/reference/tevm/errors/classes/invalidparamserror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`docsPath`](/reference/tevm/errors/classes/invalidparamserror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`message`](/reference/tevm/errors/classes/invalidparamserror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`metaMessages`](/reference/tevm/errors/classes/invalidparamserror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`name`](/reference/tevm/errors/classes/invalidparamserror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`shortMessage`](/reference/tevm/errors/classes/invalidparamserror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stack`](/reference/tevm/errors/classes/invalidparamserror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`version`](/reference/tevm/errors/classes/invalidparamserror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`prepareStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stackTraceLimit`](/reference/tevm/errors/classes/invalidparamserror/#stacktracelimit)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`walk`](/reference/tevm/errors/classes/invalidparamserror/#walk)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.18/node\_modules/bun-types/globals.d.ts:1613

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
