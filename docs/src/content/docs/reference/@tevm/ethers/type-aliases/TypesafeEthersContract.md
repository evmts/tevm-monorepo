---
editUrl: false
next: false
prev: false
title: "TypesafeEthersContract"
---

> **TypesafeEthersContract**\<`TAbi`\>: `BaseContract` & `{ [TFunctionName in ExtractAbiFunctionNames<TAbi, "pure" | "view">]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["inputs"]> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0]> }` & `{ [TFunctionName in ExtractAbiFunctionNames<TAbi, "nonpayable" | "payable">]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["inputs"]> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"]>[0], ContractTransactionResponse> }` & `object`

## Type declaration

### queryFilter()

> **queryFilter**: \<`TContractEventName`\>(`event`, `fromBlock`?, `toBlock`?) => `Promise`\<`TContractEventName` extends [`ExtractAbiEventNames`](/reference/utils/type-aliases/extractabieventnames/)\<`TAbi`\> ? [`ExtractAbiEvent`](/reference/utils/type-aliases/extractabievent/)\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

#### Type parameters

• **TContractEventName** extends `Omit`\<`ContractEventName`, [`ExtractAbiEventNames`](/reference/utils/type-aliases/extractabieventnames/)\<`TAbi`\>\> \| [`ExtractAbiEventNames`](/reference/utils/type-aliases/extractabieventnames/)\<`TAbi`\>

#### Parameters

• **event**: `TContractEventName`

• **fromBlock?**: `BlockTag`

• **toBlock?**: `BlockTag`

#### Returns

`Promise`\<`TContractEventName` extends [`ExtractAbiEventNames`](/reference/utils/type-aliases/extractabieventnames/)\<`TAbi`\> ? [`ExtractAbiEvent`](/reference/utils/type-aliases/extractabievent/)\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

## Type parameters

• **TAbi** extends [`Abi`](/reference/utils/type-aliases/abi/)

## Source

[extensions/ethers/src/contract/TypesafeEthersContract.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L19)
