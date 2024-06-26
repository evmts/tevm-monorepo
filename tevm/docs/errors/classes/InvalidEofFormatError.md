[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidEofFormatError

# Class: InvalidEofFormatError

Represents an error that occurs when an invalid EOF format is encountered during EVM execution.

This error is specific to EOF

Invalid EOF format errors can occur due to:
- Bugs in the smart contract code causing invalid EOF format.
- Issues during the deployment process resulting in invalid EOF format.

To debug an invalid EOF format error:
1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.

## Example

```typescript
import { InvalidEofFormatError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidEofFormatError
} catch (error) {
  if (error instanceof InvalidEofFormatError) {
    console.error(error.message);
    // Handle the invalid EOF format error
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

### new InvalidEofFormatError()

> **new InvalidEofFormatError**(`message`?, `args`?, `tag`?): [`InvalidEofFormatError`](InvalidEofFormatError.md)

Constructs an InvalidEofFormatError.
Represents an error that occurs when an invalid EOF format is encountered during EVM execution.

This error is specific to EOF

Invalid EOF format errors can occur due to:
- Bugs in the smart contract code causing invalid EOF format.
- Issues during the deployment process resulting in invalid EOF format.

To debug an invalid EOF format error:
1. **Review Deployment Process**: Ensure that the EOF format being used is valid and correctly generated.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract deployment and identify where the invalid EOF format is generated or deployed.

#### Parameters

• **message?**: `string`

Human-readable error message.

• **args?**: [`InvalidEofFormatErrorParameters`](../type-aliases/InvalidEofFormatErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`InvalidEofFormatError`](InvalidEofFormatError.md)

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ethereumjs/InvalidEofFormatError.d.ts:68

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:47

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`message`](ExecutionError.md#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`name`](ExecutionError.md#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stack`](ExecutionError.md#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:59

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](../../evm/enumerations/EvmErrorMessage.md)

#### Defined in

packages/errors/types/ethereum/ethereumjs/InvalidEofFormatError.d.ts:49

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

[`ExecutionError`](ExecutionError.md).[`prepareStackTrace`](ExecutionError.md#preparestacktrace)

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

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

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)

#### Defined in

packages/errors/types/ethereum/BaseError.d.ts:70

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

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21
