[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / UnreachableCodeError

# Class: UnreachableCodeError

Defined in: [packages/errors/src/defensive/UnreachableCodeError.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/UnreachableCodeError.js#L52)

Represents an error that occurs when unreachable code is executed.
This error always indicates a bug in the Tevm VM.

## Example

```javascript
import { UnreachableCodeError } from '@tevm/errors'

function assertUnreachable(x) {
  throw new UnreachableCodeError(x, 'Unreachable code executed')
}

function getArea(shape) {
  switch (shape) {
    case 'circle':
      return Math.PI * Math.pow(radius, 2)
    case 'square':
      return side * side
    default:
      return assertUnreachable(shape)
  }
}

try {
  getArea('triangle') // This should be unreachable
} catch (error) {
  if (error instanceof UnreachableCodeError) {
    console.error('Unreachable code executed:', error.message)
    console.log('Unreachable value:', error.value)
    // This indicates a bug in the Tevm VM
    reportBugToTevmRepository(error)
  }
}
```

## Extends

- [`InternalError`](InternalError.md)

## Constructors

### new UnreachableCodeError()

> **new UnreachableCodeError**(`value`, `message`?, `args`?): [`UnreachableCodeError`](UnreachableCodeError.md)

Defined in: [packages/errors/src/defensive/UnreachableCodeError.js:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/UnreachableCodeError.js#L66)

Constructs an UnreachableCodeError.

#### Parameters

##### value

`any`

The value that should be unreachable.

##### message?

`string`

Human-readable error message.

##### args?

[`UnreachableCodeErrorParameters`](../interfaces/UnreachableCodeErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

[`UnreachableCodeError`](UnreachableCodeError.md)

#### Overrides

[`InternalError`](InternalError.md).[`constructor`](InternalError.md#constructors)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: [packages/errors/src/defensive/UnreachableCodeError.js:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/UnreachableCodeError.js#L80)

Same as name, used internally.

#### Inherited from

[`InternalError`](InternalError.md).[`_tag`](InternalError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: [packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

#### Inherited from

[`InternalError`](InternalError.md).[`cause`](InternalError.md#cause)

***

### code

> **code**: `number`

Defined in: [packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code)

***

### details

> **details**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

#### Inherited from

[`InternalError`](InternalError.md).[`details`](InternalError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

#### Inherited from

[`InternalError`](InternalError.md).[`docsPath`](InternalError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`InternalError`](InternalError.md).[`message`](InternalError.md#message-1)

***

### meta

> **meta**: `undefined` \| `object`

Defined in: [packages/errors/src/ethereum/InternalErrorError.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L75)

Optional object containing additional information about the error.

#### Inherited from

[`InternalError`](InternalError.md).[`meta`](InternalError.md#meta)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: [packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

#### Inherited from

[`InternalError`](InternalError.md).[`metaMessages`](InternalError.md#metamessages)

***

### name

> **name**: `string`

Defined in: [packages/errors/src/defensive/UnreachableCodeError.js:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/UnreachableCodeError.js#L79)

The name of the error, used to discriminate errors.

#### Inherited from

[`InternalError`](InternalError.md).[`name`](InternalError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

#### Inherited from

[`InternalError`](InternalError.md).[`shortMessage`](InternalError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`InternalError`](InternalError.md).[`stack`](InternalError.md#stack)

***

### value

> **value**: `any`

Defined in: [packages/errors/src/defensive/UnreachableCodeError.js:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/defensive/UnreachableCodeError.js#L57)

The value that should be unreachable.

***

### version

> **version**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

#### Inherited from

[`InternalError`](InternalError.md).[`version`](InternalError.md#version)

***

### code

> `static` **code**: `number` = `-32603`

Defined in: [packages/errors/src/ethereum/InternalErrorError.js:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/InternalErrorError.js#L52)

The error code for InternalError.

#### Inherited from

[`InternalError`](InternalError.md).[`code`](InternalError.md#code-1)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:143

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

[`InternalError`](InternalError.md).[`prepareStackTrace`](InternalError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`InternalError`](InternalError.md).[`stackTraceLimit`](InternalError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Defined in: [packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`InternalError`](InternalError.md).[`walk`](InternalError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

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

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/bun-types@1.2.5/node\_modules/bun-types/globals.d.ts:1441

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`InternalError`](InternalError.md).[`captureStackTrace`](InternalError.md#capturestacktrace)
