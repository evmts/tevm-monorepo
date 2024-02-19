**@tevm/actions** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MissingAccountError

# Class: MissingAccountError

## Extends

- `Error`

## Constructors

### new MissingAccountError(message)

> **new MissingAccountError**(`message`?): [`MissingAccountError`](MissingAccountError.md)

#### Parameters

▪ **message?**: `string`

#### Inherited from

Error.constructor

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1081

### new MissingAccountError(message, options)

> **new MissingAccountError**(`message`?, `options`?): [`MissingAccountError`](MissingAccountError.md)

#### Parameters

▪ **message?**: `string`

▪ **options?**: `ErrorOptions`

#### Inherited from

Error.constructor

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1081

## Properties

### \_tag

> **\_tag**: `"MissingAccountError"` = `'MissingAccountError'`

#### Source

[packages/actions/src/eth/ethSignHandler.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L6)

***

### cause

> **cause**?: `unknown`

#### Inherited from

Error.cause

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

Error.message

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `"MissingAccountError"` = `'MissingAccountError'`

#### Overrides

Error.name

#### Source

[packages/actions/src/eth/ethSignHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L11)

***

### stack

> **stack**?: `string`

#### Inherited from

Error.stack

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### prepareStackTrace

> **`static`** **prepareStackTrace**?: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

Optional override for formatting stack traces

#### Parameters

▪ **err**: `Error`

▪ **stackTraces**: `CallSite`[]

#### Returns

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

##### Inherited from

Error.captureStackTrace

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

##### Inherited from

Error.captureStackTrace

##### Source

node\_modules/.pnpm/bun-types@1.0.26/node\_modules/bun-types/globals.d.ts:1525

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
