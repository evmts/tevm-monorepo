[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidSelfdestructError

# Class: InvalidSelfdestructError

Defined in: packages/errors/types/input/InvalidSelfdestructError.d.ts:39

Represents an error that occurs when the selfdestruct parameter is invalid.

This error is typically encountered when setting an account's selfdestruct status with an invalid value.

## Example

```javascript
import { InvalidSelfdestructError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient()

try {
  await client.setAccount({
    address: '0x1234567890123456789012345678901234567890',
    selfdestruct: 'not_a_boolean', // Should be a boolean
  })
} catch (error) {
  if (error instanceof InvalidSelfdestructError) {
    console.error('Invalid selfdestruct value:', error.message)
    console.log('Documentation:', error.docsLink)
  }
}
```

## Extends

- [`InvalidParamsError`](InvalidParamsError.md)

## Constructors

### new InvalidSelfdestructError()

> **new InvalidSelfdestructError**(`message`, `args`?): `InvalidSelfdestructError`

Defined in: packages/errors/types/input/InvalidSelfdestructError.d.ts:46

Constructs an InvalidSelfdestructError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`InvalidSelfdestructErrorParameters`](../type-aliases/InvalidSelfdestructErrorParameters.md)

Additional parameters for the InvalidSelfdestructError.

#### Returns

`InvalidSelfdestructError`

#### Overrides

[`InvalidParamsError`](InvalidParamsError.md).[`constructor`](InvalidParamsError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`_tag`](InvalidParamsError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`cause`](InvalidParamsError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`details`](InvalidParamsError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`docsPath`](InvalidParamsError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`message`](InvalidParamsError.md#message)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`metaMessages`](InvalidParamsError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`name`](InvalidParamsError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`shortMessage`](InvalidParamsError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`stack`](InvalidParamsError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`version`](InvalidParamsError.md#version)

***

### code

> `static` **code**: `number`

Defined in: packages/errors/types/ethereum/InvalidParamsError.d.ts:42

The error code for InvalidParamsError.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`code`](InvalidParamsError.md#code-1)

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

[`InvalidParamsError`](InvalidParamsError.md).[`prepareStackTrace`](InvalidParamsError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`stackTraceLimit`](InvalidParamsError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:71

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`walk`](InvalidParamsError.md#walk)

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

[`InvalidParamsError`](InvalidParamsError.md).[`captureStackTrace`](InvalidParamsError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.11/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`InvalidParamsError`](InvalidParamsError.md).[`captureStackTrace`](InvalidParamsError.md#capturestacktrace)
