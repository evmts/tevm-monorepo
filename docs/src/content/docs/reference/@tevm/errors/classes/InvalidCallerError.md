---
editUrl: false
next: false
prev: false
title: "InvalidCallerError"
---

Represents an error that occurs when the caller parameter is invalid.

This error is typically encountered when a transaction or operation references a caller parameter that is invalid or does not conform to the expected structure.

## Example

```ts
try {
  // Some operation that can throw an InvalidCallerError
} catch (error) {
  if (error instanceof InvalidCallerError) {
    console.error(error.message);
    // Handle the invalid caller error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the InvalidCallerError.

## Extends

- [`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/)

## Constructors

### new InvalidCallerError()

> **new InvalidCallerError**(`message`, `args`?, `tag`?): [`InvalidCallerError`](/reference/tevm/errors/classes/invalidcallererror/)

Constructs an InvalidCallerError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`InvalidCallerErrorParameters`](/reference/tevm/errors/interfaces/invalidcallererrorparameters/) = `{}`

Additional parameters for the InvalidCallerError.

• **tag?**: `string` = `'InvalidCallerError'`

The tag for the error.

#### Returns

[`InvalidCallerError`](/reference/tevm/errors/classes/invalidcallererror/)

#### Overrides

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`constructor`](/reference/tevm/errors/classes/invalidparamserror/#constructors)

#### Defined in

[packages/errors/src/input/InvalidCallerError.js:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/input/InvalidCallerError.js#L48)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`_tag`](/reference/tevm/errors/classes/invalidparamserror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

***

### cause

> **cause**: `any`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`cause`](/reference/tevm/errors/classes/invalidparamserror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`code`](/reference/tevm/errors/classes/invalidparamserror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`details`](/reference/tevm/errors/classes/invalidparamserror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`docsPath`](/reference/tevm/errors/classes/invalidparamserror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`message`](/reference/tevm/errors/classes/invalidparamserror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`metaMessages`](/reference/tevm/errors/classes/invalidparamserror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`name`](/reference/tevm/errors/classes/invalidparamserror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`shortMessage`](/reference/tevm/errors/classes/invalidparamserror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stack`](/reference/tevm/errors/classes/invalidparamserror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`version`](/reference/tevm/errors/classes/invalidparamserror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### code

> `static` **code**: `number` = `-32602`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`code`](/reference/tevm/errors/classes/invalidparamserror/#code-1)

#### Defined in

[packages/errors/src/ethereum/InvalidParamsError.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InvalidParamsError.js#L46)

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

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`stackTraceLimit`](/reference/tevm/errors/classes/invalidparamserror/#stacktracelimit)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`walk`](/reference/tevm/errors/classes/invalidparamserror/#walk)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

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

[`InvalidParamsError`](/reference/tevm/errors/classes/invalidparamserror/).[`captureStackTrace`](/reference/tevm/errors/classes/invalidparamserror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630
