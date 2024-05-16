[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / MissingAccountError

# Class: MissingAccountError

## Extends

- `Error`

## Constructors

### new MissingAccountError()

> **new MissingAccountError**(`message`?): [`MissingAccountError`](MissingAccountError.md)

#### Parameters

• **message?**: `string`

#### Returns

[`MissingAccountError`](MissingAccountError.md)

#### Inherited from

`Error.constructor`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1082

### new MissingAccountError()

> **new MissingAccountError**(`message`?, `options`?): [`MissingAccountError`](MissingAccountError.md)

#### Parameters

• **message?**: `string`

• **options?**: `ErrorOptions`

#### Returns

[`MissingAccountError`](MissingAccountError.md)

#### Inherited from

`Error.constructor`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1082

## Properties

### \_tag

> **\_tag**: `"MissingAccountError"` = `'MissingAccountError'`

#### Source

[packages/actions/src/eth/ethSignHandler.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L6)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"MissingAccountError"` = `'MissingAccountError'`

#### Overrides

`Error.name`

#### Source

[packages/actions/src/eth/ethSignHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L11)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

`Error.prepareStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

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

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Source

node\_modules/.pnpm/bun-types@1.1.8/node\_modules/bun-types/globals.d.ts:1613
