[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / TevmContract

# Type Alias: TevmContract()

> **TevmContract**: \<`TAbi`, `TFunctionName`\>(`client`, `params`) => `Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI of the contract.

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

The name of the contract function.

## Parameters

• **client**: `Client`\<[`TevmTransport`](TevmTransport.md)\<`string`\>\>

The viem client configured with TEVM transport.

• **params**: `ContractParams`\<`TAbi`, `TFunctionName`\>

Parameters for the contract method call, including ABI, function name, and arguments.

## Returns

`Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

The result of the contract method call.

## Defined in

[packages/memory-client/src/TevmContractType.ts:50](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/TevmContractType.ts#L50)
