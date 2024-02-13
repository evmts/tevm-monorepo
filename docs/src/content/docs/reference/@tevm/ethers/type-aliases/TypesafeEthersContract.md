---
editUrl: false
next: false
prev: false
title: "TypesafeEthersContract"
---

> **TypesafeEthersContract**\<`TAbi`\>: `BaseContract` & `{ [TFunctionName in ExtractAbiFunctionNames<TAbi, "pure" | "view">]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["inputs"]> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0]> }` & `{ [TFunctionName in ExtractAbiFunctionNames<TAbi, "nonpayable" | "payable">]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["inputs"]> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0], ContractTransactionResponse> }` & `object`

## Type declaration

### queryFilter

> **queryFilter**: \<`TContractEventName`\>(`event`, `fromBlock`?, `toBlock`?) => `Promise`\<`TContractEventName` extends `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

#### Type parameters

▪ **TContractEventName** extends `Omit`\<`ContractEventName`, `ExtractAbiEventNames`\<`TAbi`\>\> \| `ExtractAbiEventNames`\<`TAbi`\>

#### Parameters

▪ **event**: `TContractEventName`

▪ **fromBlock?**: `BlockTag`

▪ **toBlock?**: `BlockTag`

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends `Abi` |

## Source

[extensions/ethers/src/contract/TypesafeEthersContract.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
