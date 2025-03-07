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

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1082

### new MissingAccountError()

> **new MissingAccountError**(`message`?, `options`?): [`MissingAccountError`](MissingAccountError.md)

#### Parameters

• **message?**: `string`

• **options?**: `ErrorOptions`

#### Returns

[`MissingAccountError`](MissingAccountError.md)

#### Inherited from

`Error.constructor`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1082

## Properties

### \_tag

> **\_tag**: `"MissingAccountError"` = `'MissingAccountError'`

#### Defined in

[packages/actions/src/eth/ethSignHandler.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L6)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"MissingAccountError"` = `'MissingAccountError'`

#### Overrides

`Error.name`

#### Defined in

[packages/actions/src/eth/ethSignHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignHandler.js#L11)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

`Error.captureStackTrace`

##### Defined in

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630

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

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
