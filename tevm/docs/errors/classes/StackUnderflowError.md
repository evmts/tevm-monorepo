[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / StackUnderflowError

# Class: StackUnderflowError

Represents a contract/bytecode error that occurs when there is a stack underflow during execution.
This error is typically encountered when an operation requires more stack items than are present.

Stack underflow errors can occur due to:
- Incorrect management of stack operations (e.g., popping more items than available).
- Bugs in smart contract logic leading to unexpected stack behavior.
- Issues with function calls that manipulate the stack incorrectly.

To debug a stack underflow error:
1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles stack operations, especially in loops and conditional branches.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
3. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
- **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.

## Example

```typescript
try {
  // Some operation that can throw a StackUnderflowError
} catch (error) {
  if (error instanceof StackUnderflowError) {
    console.error(error.message);
    // Handle the stack underflow error
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

### new StackUnderflowError()

> **new StackUnderflowError**(`message`?, `args`?, `tag`?): [`StackUnderflowError`](StackUnderflowError.md)

Constructs a StackUnderflowError.
This error is typically encountered when an operation requires more stack items than are present.

Stack underflow errors can occur due to:
- Incorrect management of stack operations (e.g., popping more items than available).
- Bugs in smart contract logic leading to unexpected stack behavior.
- Issues with function calls that manipulate the stack incorrectly.

To debug a stack underflow error:
1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles stack operations, especially in loops and conditional branches.
2. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
3. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
- **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.

#### Parameters

• **message?**: `string`

Human-readable error message.

• **args?**: [`StackUnderflowErrorParameters`](../type-aliases/StackUnderflowErrorParameters.md)

Additional parameters for the BaseError.

• **tag?**: `string`

The tag for the error.

#### Returns

[`StackUnderflowError`](StackUnderflowError.md)

#### Overrides

[`ExecutionError`](ExecutionError.md).[`constructor`](ExecutionError.md#constructors)

#### Defined in

packages/errors/types/ethereum/ethereumjs/StackUnderflowError.d.ts:70

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

packages/errors/types/ethereum/ethereumjs/StackUnderflowError.d.ts:50

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
