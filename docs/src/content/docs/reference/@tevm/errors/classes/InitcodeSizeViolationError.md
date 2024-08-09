---
editUrl: false
next: false
prev: false
title: "InitcodeSizeViolationError"
---

Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.

Initcode size violation errors can occur due to:
- Bugs in the smart contract code causing the initcode to exceed the maximum size.
- Issues during the deployment process resulting in oversized initcode.

To debug an initcode size violation error:
1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.

## Example

```typescript
import { InitcodeSizeViolationError } from '@tevm/errors'
try {
  // Some operation that can throw an InitcodeSizeViolationError
} catch (error) {
  if (error instanceof InitcodeSizeViolationError) {
    console.error(error.message);
    // Handle the initcode size violation error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`ExecutionError`](/reference/tevm/errors/classes/executionerror/)

## Constructors

### new InitcodeSizeViolationError()

> **new InitcodeSizeViolationError**(`message`?, `args`?, `tag`?): [`InitcodeSizeViolationError`](/reference/tevm/errors/classes/initcodesizeviolationerror/)

Constructs an InitcodeSizeViolationError.
Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.

Initcode size violation errors can occur due to:
- Bugs in the smart contract code causing the initcode to exceed the maximum size.
- Issues during the deployment process resulting in oversized initcode.

To debug an initcode size violation error:
1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.

#### Parameters

• **message?**: `string` = `'Initcode size violation error occurred.'`

Human-readable error message.

• **args?**: [`InitcodeSizeViolationErrorParameters`](/reference/tevm/errors/interfaces/initcodesizeviolationerrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'InitcodeSizeViolationError'`

The tag for the error.

#### Returns

[`InitcodeSizeViolationError`](/reference/tevm/errors/classes/initcodesizeviolationerror/)

#### Overrides

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`constructor`](/reference/tevm/errors/classes/executionerror/#constructors)

#### Defined in

[packages/errors/src/ethereum/ethereumjs/InitcodeSizeViolationError.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/InitcodeSizeViolationError.js#L68)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`_tag`](/reference/tevm/errors/classes/executionerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L81)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`cause`](/reference/tevm/errors/classes/executionerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L113)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`code`](/reference/tevm/errors/classes/executionerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L111)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`details`](/reference/tevm/errors/classes/executionerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L90)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`docsPath`](/reference/tevm/errors/classes/executionerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L95)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`message`](/reference/tevm/errors/classes/executionerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`metaMessages`](/reference/tevm/errors/classes/executionerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L99)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`name`](/reference/tevm/errors/classes/executionerror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`shortMessage`](/reference/tevm/errors/classes/executionerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L103)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stack`](/reference/tevm/errors/classes/executionerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`version`](/reference/tevm/errors/classes/executionerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L107)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.INITCODE_SIZE_VIOLATION`

#### Defined in

[packages/errors/src/ethereum/ethereumjs/InitcodeSizeViolationError.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/InitcodeSizeViolationError.js#L51)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/executionerror/#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/executionerror/#stacktracelimit)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`walk`](/reference/tevm/errors/classes/executionerror/#walk)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@22.1.0/node\_modules/@types/node/globals.d.ts:22

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
