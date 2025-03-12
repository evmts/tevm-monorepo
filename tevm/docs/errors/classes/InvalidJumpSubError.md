[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidJumpSubError

# Class: InvalidJumpSubError

Defined in: packages/errors/types/ethereum/ethereumjs/InvalidJumpSubError.d.ts:46

Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.

Invalid JUMPSUB errors can occur due to:
- Incorrect use of the JUMPSUB opcode.
- Bugs in the smart contract code causing invalid subroutine jumps.

To debug an invalid JUMPSUB error:
1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.

## Example

```typescript
import { InvalidJumpSubError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidJumpSubError
} catch (error) {
  if (error instanceof InvalidJumpSubError) {
    console.error(error.message);
    // Handle the invalid JUMPSUB error
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

### new InvalidJumpSubError()

> **new InvalidJumpSubError**(`message`?, `args`?, `tag`?): [`InvalidJumpSubError`](InvalidJumpSubError.md)

Defined in: packages/errors/types/ethereum/ethereumjs/InvalidJumpSubError.d.ts:77

Constructs an InvalidJumpSubError.
Represents an invalid bytecode/contract error that occurs when an invalid JUMPSUB operation is executed within the EVM.

Invalid JUMPSUB errors can occur due to:
- Incorrect use of the JUMPSUB opcode.
- Bugs in the smart contract code causing invalid subroutine jumps.

To debug an invalid JUMPSUB error:
1. **Review Subroutine Logic**: Ensure that the JUMPSUB opcode is used correctly within subroutine definitions.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the invalid JUMPSUB occurs.

#### Parameters

##### message?

`string`

Human-readable error message.

##### args?

[`InvalidJumpSubErrorParameters`](../type-aliases/InvalidJumpSubErrorParameters.md)

Additional parameters for the BaseError.

##### tag?

`string`

The tag for the error.}

#### Returns

[`InvalidJumpSubError`](InvalidJumpSubError.md)

#### Example

```typescript
import { InvalidJumpSubError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidJumpSubError
} catch (error) {
  if (error instanceof InvalidJumpSubError) {
    console.error(error.message);
    // Handle the invalid JUMPSUB error
  }
}
```

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructors)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`docsPath`](ExecutionError.md#docspath)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`message`](ExecutionError.md#message-1)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`metaMessages`](ExecutionError.md#metamessages)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`name`](ExecutionError.md#name)

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`shortMessage`](ExecutionError.md#shortmessage)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stack`](ExecutionError.md#stack)

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

***

### code

> `static` **code**: `number`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:42

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](../../evm/enumerations/EvmErrorMessage.md)

Defined in: packages/errors/types/ethereum/ethereumjs/InvalidJumpSubError.d.ts:47

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:143

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

[`ExecutionError`](ExecutionError.md).[`prepareStackTrace`](ExecutionError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

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

[`ExecutionError`](ExecutionError.md).[`walk`](ExecutionError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.8/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)
