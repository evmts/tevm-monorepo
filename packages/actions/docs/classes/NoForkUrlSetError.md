[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / NoForkUrlSetError

# Class: NoForkUrlSetError

Defined in: [packages/actions/src/eth/getBalanceHandler.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/getBalanceHandler.js#L6)

## Extends

- `Error`

## Constructors

### Constructor

> **new NoForkUrlSetError**(`message?`): `NoForkUrlSetError`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1082

#### Parameters

##### message?

`string`

#### Returns

`NoForkUrlSetError`

#### Inherited from

`Error.constructor`

### Constructor

> **new NoForkUrlSetError**(`message?`, `options?`): `NoForkUrlSetError`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1082

#### Parameters

##### message?

`string`

##### options?

`ErrorOptions`

#### Returns

`NoForkUrlSetError`

#### Inherited from

`Error.constructor`

### Constructor

> **new NoForkUrlSetError**(`message?`, `options?`): `NoForkUrlSetError`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1082

#### Parameters

##### message?

`string`

##### options?

`ErrorOptions`

#### Returns

`NoForkUrlSetError`

#### Inherited from

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"NoForkUrlSetError"` = `'NoForkUrlSetError'`

Defined in: [packages/actions/src/eth/getBalanceHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/getBalanceHandler.js#L10)

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

The cause of the error.

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `"NoForkUrlSetError"` = `'NoForkUrlSetError'`

Defined in: [packages/actions/src/eth/getBalanceHandler.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/getBalanceHandler.js#L15)

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:962

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

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:967

The maximum number of stack frames to capture.

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:955

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

`Error.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/.pnpm/@types+node@22.15.3/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

***

### isError()

> `static` **isError**(`value`): `value is Error`

Defined in: node\_modules/.pnpm/bun-types@1.2.11/node\_modules/bun-types/globals.d.ts:950

Check if a value is an instance of Error

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

#### Inherited from

`Error.isError`
