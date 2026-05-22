[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / CodeStoreOutOfGasError

# Class: CodeStoreOutOfGasError

Represents an error that occurs when a transaction runs out of gas during code storage.
This error is typically encountered when the gas provided for storing code is insufficient to complete its execution.
EVM transaction execution metadata level error

Code store out of gas errors can occur due to:
- Insufficient gas provided for storing large contracts.
- Incorrect estimation of gas required for storing code.
- Contracts with high gas consumption during the deployment phase.
- Non-deterministic gas usage during code storage.
- If TEVM submitted the transaction using `createTransaction: true` and the account being used runs out of gas.

To debug a code store out of gas error:
1. **Review Gas Estimates**: Ensure that the gas estimate for your transaction is accurate and sufficient, especially for large contracts. If you provided explicit gas-related parameters, double-check their values.
2. **Optimize Contract Code**: Refactor your smart contract code to reduce gas consumption during deployment. Consider simplifying complex initialization code.
3. **Use TEVM Tracing**: Utilize TEVM tracing to step through the deployment process and inspect gas usage.
4. **Estimate Gas Multiple Times**: If using TEVM gas estimations, it might make sense to estimate gas many times and take the worst case to set `gasPrice`. Most nodes execute `eth_estimateGas` 10 times, while TEVM runs it only once.
5. **Use Other Tools**: Use other tools such as [Foundry](https://book.getfoundry.sh/forge/gas). If it works in Foundry, consider [opening a Tevm bug report](https://github.com/evmts/tevm-monorepo/issues).

## Example

```typescript
import { CodeStoreOutOfGasError } from '@tevm/errors'
try {
  // Some operation that can throw a CodeStoreOutOfGasError
} catch (error) {
  if (error instanceof CodeStoreOutOfGasError) {
    console.error(error.message);
    // Handle the code store out of gas error
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`GasLimitExceededError`](GasLimitExceededError.md)

## Constructors

### Constructor

> **new CodeStoreOutOfGasError**(`message?`, `args?`, `tag?`): `CodeStoreOutOfGasError`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message?` | `string` | Human-readable error message. |
| `args?` | [`CodeStoreOutOfGasErrorParameters`](../type-aliases/CodeStoreOutOfGasErrorParameters.md) | Additional parameters. |
| `tag?` | `string` | Internal error tag. |

#### Returns

`CodeStoreOutOfGasError`

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath) |
| <a id="message"></a> `message` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`message`](GasLimitExceededError.md#message) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages) |
| <a id="name"></a> `name` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`name`](GasLimitExceededError.md#name) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage) |
| <a id="stack"></a> `stack?` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`stack`](GasLimitExceededError.md#stack) |
| <a id="version"></a> `version` | `public` | `string` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | The error code for GasLimitExceededError. | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | - | - |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`GasLimitExceededError`](GasLimitExceededError.md).[`stackTraceLimit`](GasLimitExceededError.md#stacktracelimit) |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`walk`](GasLimitExceededError.md#walk)

***

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

##### Returns

`void`

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`captureStackTrace`](GasLimitExceededError.md#capturestacktrace)

***

### isError()

> `static` **isError**(`error`): `error is Error`

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`error is Error`

#### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`isError`](GasLimitExceededError.md#iserror)

***

### prepareStackTrace()

#### Call Signature

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

##### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`prepareStackTrace`](GasLimitExceededError.md#preparestacktrace)

#### Call Signature

> `static` **prepareStackTrace**(`err`, `stackTraces`): `any`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

##### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Inherited from

[`GasLimitExceededError`](GasLimitExceededError.md).[`prepareStackTrace`](GasLimitExceededError.md#preparestacktrace)
