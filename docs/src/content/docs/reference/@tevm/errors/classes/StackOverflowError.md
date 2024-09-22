---
editUrl: false
next: false
prev: false
title: "StackOverflowError"
---

Represents an invalid bytecode error that occurs when there is a stack overflow during execution.
This error is typically encountered when an operation causes the stack to exceed its limit.

Stack overflow errors can occur due to:
- Excessive recursion leading to too many function calls.
- Bugs in smart contract logic that cause infinite loops or excessive stack usage.
- Incorrect management of stack operations (e.g., pushing too many items onto the stack).

To debug a stack overflow error:
1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles recursion and stack operations.
2. **Optimize Stack Usage**: Refactor your code to reduce stack usage, such as minimizing the depth of recursive calls.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
4. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
- **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.

## Example

```typescript
try {
  // Some operation that can throw a StackOverflowError
} catch (error) {
  if (error instanceof StackOverflowError) {
    console.error(error.message);
    // Handle the stack overflow error
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

### new StackOverflowError()

> **new StackOverflowError**(`message`?, `args`?, `tag`?): [`StackOverflowError`](/reference/tevm/errors/classes/stackoverflowerror/)

Constructs a StackOverflowError.
Represents an invalid bytecode error that occurs when there is a stack overflow during execution.
This error is typically encountered when an operation causes the stack to exceed its limit.

Stack overflow errors can occur due to:
- Excessive recursion leading to too many function calls.
- Bugs in smart contract logic that cause infinite loops or excessive stack usage.
- Incorrect management of stack operations (e.g., pushing too many items onto the stack).

To debug a stack overflow error:
1. **Review Contract Logic**: Ensure that your smart contract logic correctly handles recursion and stack operations.
2. **Optimize Stack Usage**: Refactor your code to reduce stack usage, such as minimizing the depth of recursive calls.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the transaction and inspect stack changes.
4. **Use Other Tools**: Use other tools with tracing such as [Foundry](https://book.getfoundry.sh/forge/traces).
- **Ethereumjs Source**: Refer to the [source file](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/stack.ts) where this error can occur.

#### Parameters

• **message?**: `string` = `'Stack overflow error occurred.'`

Human-readable error message.

• **args?**: [`StackOverflowErrorParameters`](/reference/tevm/errors/interfaces/stackoverflowerrorparameters/) = `{}`

Additional parameters for the BaseError.

• **tag?**: `string` = `'StackOverflowError'`

The tag for the error.

#### Returns

[`StackOverflowError`](/reference/tevm/errors/classes/stackoverflowerror/)

#### Overrides

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`constructor`](/reference/tevm/errors/classes/executionerror/#constructors)

#### Defined in

[packages/errors/src/ethereum/ethereumjs/StackOverflowError.js:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/StackOverflowError.js#L78)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`_tag`](/reference/tevm/errors/classes/executionerror/#_tag)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

***

### cause

> **cause**: `any`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`cause`](/reference/tevm/errors/classes/executionerror/#cause)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

***

### code

> **code**: `number`

Error code, analogous to the code in JSON RPC error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`code`](/reference/tevm/errors/classes/executionerror/#code)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`details`](/reference/tevm/errors/classes/executionerror/#details)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`docsPath`](/reference/tevm/errors/classes/executionerror/#docspath)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Human-readable error message.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`message`](/reference/tevm/errors/classes/executionerror/#message)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`metaMessages`](/reference/tevm/errors/classes/executionerror/#metamessages)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

The name of the error, used to discriminate errors.

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`name`](/reference/tevm/errors/classes/executionerror/#name)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`shortMessage`](/reference/tevm/errors/classes/executionerror/#shortmessage)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stack`](/reference/tevm/errors/classes/executionerror/#stack)

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`version`](/reference/tevm/errors/classes/executionerror/#version)

#### Defined in

[packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

***

### EVMErrorMessage

> `static` **EVMErrorMessage**: [`EvmErrorMessage`](/reference/tevm/evm/enumerations/evmerrormessage/) = `EVMErrorMessage.STACK_OVERFLOW`

#### Defined in

[packages/errors/src/ethereum/ethereumjs/StackOverflowError.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/ethereumjs/StackOverflowError.js#L56)

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

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`stackTraceLimit`](/reference/tevm/errors/classes/executionerror/#stacktracelimit)

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

[`ExecutionError`](/reference/tevm/errors/classes/executionerror/).[`walk`](/reference/tevm/errors/classes/executionerror/#walk)

#### Defined in

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

##### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21

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

##### Defined in

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67

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

##### Defined in

node\_modules/.pnpm/@types+node@20.14.15/node\_modules/@types/node/globals.d.ts:21

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

##### Defined in

node\_modules/.pnpm/bun-types@1.1.22/node\_modules/bun-types/globals.d.ts:1629

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

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
