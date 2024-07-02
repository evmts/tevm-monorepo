---
editUrl: false
next: false
prev: false
title: "TevmContract"
---

> **TevmContract**: \<`TAbi`, `TFunctionName`\>(`client`, `params`) => `Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

The ABI of the contract.

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

The name of the contract function.

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>\>

The viem client configured with TEVM transport.

• **params**: [`ContractParams`](/reference/tevm/actions/type-aliases/contractparams/)\<`TAbi`, `TFunctionName`\>

Parameters for the contract method call, including ABI, function name, and arguments.

## Returns

`Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

The result of the contract method call.

## Defined in

[packages/memory-client/src/TevmContractType.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmContractType.ts#L50)
