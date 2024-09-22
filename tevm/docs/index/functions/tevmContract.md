[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / tevmContract

# Function: tevmContract()

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<[`ContractResult`](../type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

A tree-shakeable version of the `tevmContract` action for viem.
Interacts with a contract method call using TEVM.

Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.

## Type Parameters

• **TAbi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../type-aliases/Abi.md)

• **TFunctionName** *extends* `string` = [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`TAbi`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>\>

• **params**: [`ContractParams`](../type-aliases/ContractParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](../type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

## Defined in

packages/memory-client/types/tevmContract.d.ts:39
