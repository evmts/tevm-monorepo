---
editUrl: false
next: false
prev: false
title: "AccountNotFoundError"
---

Represents an error that occurs when an account cannot be found in the state.

This error is typically encountered when a transaction or operation references an account that does not exist in the blockchain state.

## Example

```ts
try {
  // Some operation that can throw an AccountNotFoundError
} catch (error) {
  if (error instanceof AccountNotFoundError) {
    console.error(error.message);
    // Handle the account not found error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the ResourceNotFoundError.

## Extends

- [`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/)

## Constructors

### new AccountNotFoundError()

> **new AccountNotFoundError**(`message`, `args`?): [`AccountNotFoundError`](/reference/tevm/errors/classes/accountnotfounderror/)

Constructs an AccountNotFoundError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: `AccountNotFoundErrorParameters`= `{}`

Additional parameters for the ResourceNotFoundError.

#### Returns

[`AccountNotFoundError`](/reference/tevm/errors/classes/accountnotfounderror/)

#### Overrides

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`constructor`](/reference/tevm/errors/classes/resourcenotfounderror/#constructors)

#### Source

[packages/errors/src/ethereum/AccountNotFoundError.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/AccountNotFoundError.js#L47)

## Properties

### \_tag

> **\_tag**: `"ResourceNotFound"` = `'ResourceNotFound'`

Same as name, used internally.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`_tag`](/reference/tevm/errors/classes/resourcenotfounderror/#_tag)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L70)

***

### cause

> **cause**: `any`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`cause`](/reference/tevm/errors/classes/resourcenotfounderror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`code`](/reference/tevm/errors/classes/resourcenotfounderror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`details`](/reference/tevm/errors/classes/resourcenotfounderror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`docsPath`](/reference/tevm/errors/classes/resourcenotfounderror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`message`](/reference/tevm/errors/classes/resourcenotfounderror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`meta`](/reference/tevm/errors/classes/resourcenotfounderror/#meta)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L63)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`metaMessages`](/reference/tevm/errors/classes/resourcenotfounderror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `"ResourceNotFound"` = `'ResourceNotFound'`

The name of the error, used to discriminate errors.

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`name`](/reference/tevm/errors/classes/resourcenotfounderror/#name)

#### Source

[packages/errors/src/ethereum/ResourceNotFoundError.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ResourceNotFoundError.js#L76)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`shortMessage`](/reference/tevm/errors/classes/resourcenotfounderror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`stack`](/reference/tevm/errors/classes/resourcenotfounderror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`version`](/reference/tevm/errors/classes/resourcenotfounderror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

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

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`prepareStackTrace`](/reference/tevm/errors/classes/resourcenotfounderror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`stackTraceLimit`](/reference/tevm/errors/classes/resourcenotfounderror/#stacktracelimit)

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

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`walk`](/reference/tevm/errors/classes/resourcenotfounderror/#walk)

#### Source

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

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`captureStackTrace`](/reference/tevm/errors/classes/resourcenotfounderror/#capturestacktrace)

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

[`ResourceNotFoundError`](/reference/tevm/errors/classes/resourcenotfounderror/).[`captureStackTrace`](/reference/tevm/errors/classes/resourcenotfounderror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.13/node\_modules/bun-types/globals.d.ts:1613
