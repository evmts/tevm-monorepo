[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / InvalidOpcodeError

# Class: InvalidOpcodeError

Defined in: packages/errors/src/ethereum/ethereumjs/InvalidOpcodeError.js:53

Represents an invalid bytecode/contract error that occurs when an invalid opcode is encountered during EVM execution.
This error is typically encountered when the bytecode contains an opcode that is not recognized by the EVM.

Invalid opcode errors can occur due to:
- Typographical errors in the bytecode.
- Using opcodes that are not supported by the selected EVM version or hardfork.

To debug an invalid opcode error:
1. **Review Bytecode**: Ensure that the bytecode provided is correct and does not contain any invalid opcodes.
2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the opcodes used by your contract.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid opcode is encountered.
4. **Inspect Contract Code**: Manually inspect the contract code to ensure it compiles correctly and does not include any invalid opcodes.

## Example

```typescript
import { InvalidOpcodeError } from '@tevm/errors'
try {
  // Some operation that can throw an InvalidOpcodeError
} catch (error) {
  if (error instanceof InvalidOpcodeError) {
    console.error(error.message);
    // Handle the invalid opcode error
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

> **new InvalidOpcodeError**(`message?`, `args?`, `tag?`): `InvalidOpcodeError`

Defined in: packages/errors/src/ethereum/ethereumjs/InvalidOpcodeError.js:74

Constructs an InvalidOpcodeError.
Represents an invalid bytecode/contract error that occurs when an invalid opcode is encountered during EVM execution.
This error is typically encountered when the bytecode contains an opcode that is not recognized by the EVM.

Invalid opcode errors can occur due to:
- Typographical errors in the bytecode.
- Using opcodes that are not supported by the selected EVM version or hardfork.

To debug an invalid opcode error:
1. **Review Bytecode**: Ensure that the bytecode provided is correct and does not contain any invalid opcodes.
2. **Verify Common Configuration**: Ensure you are using a `common` with the correct hardfork and EIPs that support the opcodes used by your contract.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the bytecode execution and identify where the invalid opcode is encountered.
4. **Inspect Contract Code**: Manually inspect the contract code to ensure it compiles correctly and does not include any invalid opcodes.

#### Parameters

##### message?

`string` = `'Invalid opcode error occurred.'`

Human-readable error message.

##### args?

[`InvalidOpcodeErrorParameters`](../interfaces/InvalidOpcodeErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'InvalidOpcodeError'`

The tag for the error.}

#### Returns

`InvalidOpcodeError`

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:82

Same as name, used internally.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`_tag`](ExecutionError.md#_tag)

***

### cause

> **cause**: `any`

Defined in: packages/errors/src/ethereum/BaseError.js:114

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`cause`](ExecutionError.md#cause)

***

### code

> **code**: `number`

Defined in: packages/errors/src/ethereum/BaseError.js:112

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code)

***

### details

> **details**: `string`

Defined in: packages/errors/src/ethereum/BaseError.js:91

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`details`](ExecutionError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/src/ethereum/BaseError.js:96

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

Defined in: packages/errors/src/ethereum/BaseError.js:100

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

Defined in: packages/errors/src/ethereum/BaseError.js:104

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

Defined in: packages/errors/src/ethereum/BaseError.js:108

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`version`](ExecutionError.md#version)

***

### code

> `static` **code**: `number` = `-32000`

Defined in: packages/errors/src/ethereum/ExecutionErrorError.js:46

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`code`](ExecutionError.md#code-1)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: `string` = `EVMError.errorMessages.INVALID_OPCODE`

Defined in: packages/errors/src/ethereum/ethereumjs/InvalidOpcodeError.js:54

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:960

The maximum number of stack frames to capture.

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`stackTraceLimit`](ExecutionError.md#stacktracelimit)

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Defined in: packages/errors/src/ethereum/BaseError.js:137

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

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:955

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

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:145

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

[`ExecutionError`](ExecutionError.md).[`captureStackTrace`](ExecutionError.md#capturestacktrace)

***

### isError()

> `static` **isError**(`value`): `value is Error`

Defined in: node\_modules/.pnpm/bun-types@1.2.14/node\_modules/bun-types/globals.d.ts:950

Check if a value is an instance of Error

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Error`

True if the value is an instance of Error, false otherwise

#### Inherited from

[`ExecutionError`](ExecutionError.md).[`isError`](ExecutionError.md#iserror)

***

### prepareStackTrace()

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

Defined in: node\_modules/.pnpm/@types+node@22.15.21/node\_modules/@types/node/globals.d.ts:149

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
