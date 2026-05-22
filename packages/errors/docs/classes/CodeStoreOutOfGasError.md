[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / CodeStoreOutOfGasError

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

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `message?` | `string` | `'Code store out of gas error occurred.'` | Human-readable error message. |
| `args?` | [`CodeStoreOutOfGasErrorParameters`](../interfaces/CodeStoreOutOfGasErrorParameters.md) | `{}` | Additional parameters. |
| `tag?` | `string` | `'CodeStoreOutOfGasError'` | Internal error tag. |

#### Returns

`CodeStoreOutOfGasError`

#### Overrides

[`GasLimitExceededError`](GasLimitExceededError.md).[`constructor`](GasLimitExceededError.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`_tag`](GasLimitExceededError.md#_tag) |
| <a id="cause"></a> `cause` | `public` | `any` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`cause`](GasLimitExceededError.md#cause) |
| <a id="code"></a> `code` | `public` | `number` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code) |
| <a id="details"></a> `details` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`details`](GasLimitExceededError.md#details) |
| <a id="docspath"></a> `docsPath` | `public` | `string` \| `undefined` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`docsPath`](GasLimitExceededError.md#docspath) |
| <a id="metamessages"></a> `metaMessages` | `public` | `string`[] \| `undefined` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`metaMessages`](GasLimitExceededError.md#metamessages) |
| <a id="shortmessage"></a> `shortMessage` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`shortMessage`](GasLimitExceededError.md#shortmessage) |
| <a id="version"></a> `version` | `public` | `string` | `undefined` | - | [`GasLimitExceededError`](GasLimitExceededError.md).[`version`](GasLimitExceededError.md#version) |
| <a id="code-1"></a> `code` | `static` | `number` | `-32003` | The error code for GasLimitExceededError. | [`GasLimitExceededError`](GasLimitExceededError.md).[`code`](GasLimitExceededError.md#code-1) |
| <a id="evmerrormessage"></a> `EVMErrorMessage` | `static` | `string` | `EVMError.errorMessages.CODESTORE_OUT_OF_GAS` | - | - |

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
