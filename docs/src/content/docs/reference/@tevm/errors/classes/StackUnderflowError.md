---
editUrl: false
next: false
prev: false
title: "StackUnderflowError"
---

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

- [`ExecutionError`](/reference/tevm/errors/classes/executionerror/)

## Constructors

### new StackUnderflowError()

> **new StackUnderflowError**(`message`?, `args`?): [`StackUnderflowError`](/reference/tevm/errors/classes/stackunderflowerror/)

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

• **message?**: `string`= `'Stack underflow error occurred.'`

Human-readable error message.

• **args?**: [`StackUnderflowErrorParameters`](/reference/tevm/errors/interfaces/stackunderflowerrorparameters/)= `{}`

Additional parameters for the BaseError.

#### Returns

[`StackUnderflowError`](/reference/tevm/errors/classes/stackunderflowerror/)

#### Overrides

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`constructor`](/reference/tevm/errors/classes/executionerror/#constructors)

#### Source

[packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js#L73)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`_tag`](/reference/tevm/errors/classes/executionerror/#_tag)

#### Source

[packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js#L90)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`cause`](/reference/tevm/errors/classes/executionerror/#cause)

#### Source

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`code`](/reference/tevm/errors/classes/executionerror/#code)

#### Source

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`details`](/reference/tevm/errors/classes/executionerror/#details)

#### Source

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`docsPath`](/reference/tevm/errors/classes/executionerror/#docspath)

#### Source

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`message`](/reference/tevm/errors/classes/executionerror/#message)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### meta

> **meta**: `undefined` \| `object`

Optional object containing additional information about the error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`meta`](/reference/tevm/errors/classes/executionerror/#meta)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L69)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`metaMessages`](/reference/tevm/errors/classes/executionerror/#metamessages)

#### Source

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `"ExecutionError"` = `'ExecutionError'`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`name`](/reference/tevm/errors/classes/executionerror/#name)

#### Source

[packages/errors/src/ethereum/ExecutionErrorError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ExecutionErrorError.js#L82)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`shortMessage`](/reference/tevm/errors/classes/executionerror/#shortmessage)

#### Source

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stack`](/reference/tevm/errors/classes/executionerror/#stack)

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`version`](/reference/tevm/errors/classes/executionerror/#version)

#### Source

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.STACK_UNDERFLOW`

#### Source

[packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/StackUnderflowError.js#L54)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`prepareStackTrace`](/reference/tevm/errors/classes/executionerror/#preparestacktrace)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/executionerror/#stacktracelimit)

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:30

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`walk`](/reference/tevm/errors/classes/executionerror/#walk)

#### Source

[packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

***

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`captureStackTrace`](/reference/tevm/errors/classes/executionerror/#capturestacktrace)

##### Source

node\_modules/.pnpm/bun-types@1.1.13/node\_modules/bun-types/globals.d.ts:1613
