[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / OutOfRangeError

# Class: OutOfRangeError

Defined in: packages/errors/types/ethereum/ethereumjs/OutOfRangeError.d.ts:50

Represents an invalid bytecode/contract error that occurs when a value is out of the allowable range during EVM execution.
This error is typically encountered when an operation results in a value that exceeds the allowed limits.

Value out of range errors can occur due to:
- Arithmetic operations that result in overflow or underflow.
- Incorrect handling of large numbers in the smart contract code.
- Bugs in the smart contract code causing values to exceed their expected range.

To debug a value out of range error:
1. **Review Arithmetic Operations**: Ensure that arithmetic operations in the contract are correctly handling large numbers and preventing overflow/underflow.
2. **Check Value Assignments**: Verify that values assigned to variables are within the allowable range and properly validated.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the value goes out of range.
4. **Inspect Contract Logic**: Manually inspect the contract code to ensure that all value assignments and operations are within the expected limits.

## Example

```typescript
import { OutOfRangeError } from '@tevm/errors'
try {
  // Some operation that can throw an OutOfRangeError
} catch (error) {
  if (error instanceof OutOfRangeError) {
    console.error(error.message);
    // Handle the value out of range error
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

### Constructor

> **new OutOfRangeError**(`message?`, `args?`, `tag?`): `OutOfRangeError`

Defined in: packages/errors/types/ethereum/ethereumjs/OutOfRangeError.d.ts:72

Constructs an OutOfRangeError.
Represents an invalid bytecode/contract error that occurs when a value is out of the allowable range during EVM execution.
This error is typically encountered when an operation results in a value that exceeds the allowed limits.

Value out of range errors can occur due to:
- Arithmetic operations that result in overflow or underflow.
- Incorrect handling of large numbers in the smart contract code.
- Bugs in the smart contract code causing values to exceed their expected range.

To debug a value out of range error:
1. **Review Arithmetic Operations**: Ensure that arithmetic operations in the contract are correctly handling large numbers and preventing overflow/underflow.
2. **Check Value Assignments**: Verify that values assigned to variables are within the allowable range and properly validated.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the contract execution and identify where the value goes out of range.
4. **Inspect Contract Logic**: Manually inspect the contract code to ensure that all value assignments and operations are within the expected limits.

#### Parameters

##### message?

`string`

Human-readable error message.

##### args?

[`OutOfRangeErrorParameters`](../type-aliases/OutOfRangeErrorParameters.md)

Additional parameters for the BaseError.

##### tag?

`string`

The tag for the error.

#### Returns

`OutOfRangeError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

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

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

Human-readable error message.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`message`](ExecutionError.md#message)

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

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

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

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

Defined in: packages/errors/types/ethereum/ethereumjs/OutOfRangeError.d.ts:51

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

[`ExecutionError`](ExecutionError.md).[`prepareStackTrace`](ExecutionError.md#preparestacktrace)

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

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

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)
