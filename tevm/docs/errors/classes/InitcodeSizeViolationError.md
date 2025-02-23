[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InitcodeSizeViolationError

# Class: InitcodeSizeViolationError

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

- [`ExecutionError`](ExecutionError.md)

## Constructors

### new InitcodeSizeViolationError()

> **new InitcodeSizeViolationError**(`message`?, `args`?, `tag`?): [`InitcodeSizeViolationError`](InitcodeSizeViolationError.md)

Constructs an InitcodeSizeViolationError.
Represents a calldata/creation error that occurs when initcode exceeds the maximum allowable size during EVM execution.

Initcode size violation errors can occur due to:
- Bugs in the smart contract code causing the initcode to exceed the maximum size.
- Issues during the deployment process resulting in oversized initcode.

To debug an initcode size violation error:
1. **Review Deployment Process**: Ensure that the initcode being deployed is within the allowable size limits.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the initcode size violation occurs.

#### Parameters

• **message?**: `string`

Human-readable error message.

• **args?**: [`InitcodeSizeViolationErrorParameters`](../type-aliases/InitcodeSizeViolationErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`InitcodeSizeViolationError`](InitcodeSizeViolationError.md)

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ethereumjs/InitcodeSizeViolationError.d.ts:64

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:40

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:65

***

### code

> **code**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:44

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:48

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`message`](ExecutionError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`name`](ExecutionError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:56

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stack`](ExecutionError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:60

***

### code

> `static` **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

#### Defined in

packages/errors/types/ethereum/ExecutionErrorError.d.ts:42

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](../../evm/enumerations/EvmErrorMessage.md)

#### Defined in

packages/errors/types/ethereum/ethereumjs/InitcodeSizeViolationError.d.ts:47

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

[`ExecutionError`](ExecutionError.md).[`prepareStackTrace`](ExecutionError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

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

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
