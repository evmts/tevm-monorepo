[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / NoForkTransportSetError

# Class: NoForkTransportSetError

Error represents the tevm client attempted to fetch a resource from a Forked transport but no transport was set.

## Example

```javascript
import { NoForkTransportSetError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient() // No fork configuration

try {
  await client.getBalance('0x...') // This might throw if it needs to access forked state
} catch (error) {
  if (error instanceof NoForkTransportSetError) {
    console.error('No fork transport set:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the error, e.g., by setting up a fork configuration
  }
}
```

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### new NoForkTransportSetError()

> **new NoForkTransportSetError**(`message`, `args`?): [`NoForkTransportSetError`](NoForkTransportSetError.md)

Constructs a NoForkTransportSetError.

#### Parameters

• **message**: `string`

Human-readable error message.

• **args?**: [`NoForkTransportSetErrorParameters`](../type-aliases/NoForkTransportSetErrorParameters.md)

Additional parameters for the error.

#### Returns

[`NoForkTransportSetError`](NoForkTransportSetError.md)

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructors)

#### Defined in

packages/errors/types/fork/NoForkUriSetError.d.ts:42

## Properties

### \_tag

> **\_tag**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:40

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`message`](BaseError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`name`](BaseError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`stack`](BaseError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

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

[`BaseError`](BaseError.md).[`prepareStackTrace`](BaseError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`stackTraceLimit`](BaseError.md#stacktracelimit)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:71

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`BaseError`](BaseError.md).[`captureStackTrace`](BaseError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
