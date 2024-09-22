[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmContract

# Function: tevmContract()

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

A tree-shakeable version of the `tevmContract` action for viem.
Interacts with a contract method call using TEVM.

Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.

## Type Parameters

• **TAbi** *extends* readonly `unknown`[] \| `Abi` = `Abi`

• **TFunctionName** *extends* `string` = `ContractFunctionName`\<`TAbi`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>\>

• **params**: `ContractParams`\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

## Defined in

[packages/memory-client/src/tevmContract.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmContract.js#L41)
