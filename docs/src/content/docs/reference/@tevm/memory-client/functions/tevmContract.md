---
editUrl: false
next: false
prev: false
title: "tevmContract"
---

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

A tree-shakeable version of the `tevmContract` action for viem.
Interacts with a contract method call using TEVM.

Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* `string` = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>\>

• **params**: [`ContractParams`](/reference/tevm/actions/type-aliases/contractparams/)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

## Defined in

[packages/memory-client/src/tevmContract.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmContract.js#L41)
