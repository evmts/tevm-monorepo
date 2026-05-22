[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / BaseContractMethod

# Type Alias: BaseContractMethod()\<TArguments, TReturnType, TExtendedReturnType\>

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\> = `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L4)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TArguments` *extends* `ReadonlyArray`\<`any`\> | `ReadonlyArray`\<`any`\> |
| `TReturnType` | `any` |
| `TExtendedReturnType` *extends* `TReturnType` \| `ContractTransactionResponse` | `ContractTransactionResponse` |

> **BaseContractMethod**(...`args`): `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\> |

## Returns

`Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="_contract"></a> `_contract` | `public` | `BaseContract` | [extensions/ethers/src/contract/BaseContractMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L13) |
| <a id="_key"></a> `_key` | `public` | `string` | [extensions/ethers/src/contract/BaseContractMethod.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L15) |
| <a id="estimategas"></a> `estimateGas` | `public` | (...`args`) => `Promise`\<`bigint`\> | [extensions/ethers/src/contract/BaseContractMethod.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L18) |
| <a id="fragment"></a> `fragment` | `readonly` | `FunctionFragment` | [extensions/ethers/src/contract/BaseContractMethod.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L24) |
| <a id="getfragment"></a> `getFragment` | `public` | (...`args`) => `FunctionFragment` | [extensions/ethers/src/contract/BaseContractMethod.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L17) |
| <a id="name"></a> `name` | `public` | `string` | [extensions/ethers/src/contract/BaseContractMethod.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L11) |
| <a id="populatetransaction"></a> `populateTransaction` | `public` | (...`args`) => `Promise`\<`ContractTransaction`\> | [extensions/ethers/src/contract/BaseContractMethod.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L19) |
| <a id="send"></a> `send` | `public` | (...`args`) => `Promise`\<`ContractTransactionResponse`\> | [extensions/ethers/src/contract/BaseContractMethod.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L20) |
| <a id="staticcall"></a> `staticCall` | `public` | (...`args`) => `Promise`\<`TReturnType`\> | [extensions/ethers/src/contract/BaseContractMethod.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L21) |
| <a id="staticcallresult"></a> `staticCallResult` | `public` | (...`args`) => `Promise`\<`Result`\> | [extensions/ethers/src/contract/BaseContractMethod.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L22) |
