[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmContract

# Type Alias: TevmContract()

> **TevmContract**: \<`TAbi`, `TFunctionName`\>(`client`, `params`) => `Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

## Type Parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

The ABI of the contract.

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

The name of the contract function.

## Parameters

• **client**: `Client`\<[`TevmTransport`](TevmTransport.md)\<`string`\>\>

The viem client configured with TEVM transport.

• **params**: [`ContractParams`](ContractParams.md)\<`TAbi`, `TFunctionName`\>

Parameters for the contract method call, including ABI, function name, and arguments.

## Returns

`Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

The result of the contract method call.

## Defined in

packages/memory-client/types/TevmContractType.d.ts:49
