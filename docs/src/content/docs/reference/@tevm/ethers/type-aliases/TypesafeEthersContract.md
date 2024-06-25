---
editUrl: false
next: false
prev: false
title: "TypesafeEthersContract"
---

> **TypesafeEthersContract**\<`TAbi`\>: `BaseContract` & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "pure" \| "view"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\]\> \} & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "nonpayable" \| "payable"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\], ContractTransactionResponse\> \} & `object`

## Type declaration

### queryFilter()

> **queryFilter**: \<`TContractEventName`\>(`event`, `fromBlock`?, `toBlock`?) => `Promise`\<`TContractEventName` *extends* [`ExtractAbiEventNames`](/reference/tevm/utils/type-aliases/extractabieventnames/)\<`TAbi`\> ? [`ExtractAbiEvent`](/reference/tevm/utils/type-aliases/extractabievent/)\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

#### Type Parameters

• **TContractEventName** *extends* `Omit`\<`ContractEventName`, [`ExtractAbiEventNames`](/reference/tevm/utils/type-aliases/extractabieventnames/)\<`TAbi`\>\> \| [`ExtractAbiEventNames`](/reference/tevm/utils/type-aliases/extractabieventnames/)\<`TAbi`\>

#### Parameters

• **event**: `TContractEventName`

• **fromBlock?**: `BlockTag`

• **toBlock?**: `BlockTag`

#### Returns

`Promise`\<`TContractEventName` *extends* [`ExtractAbiEventNames`](/reference/tevm/utils/type-aliases/extractabieventnames/)\<`TAbi`\> ? [`ExtractAbiEvent`](/reference/tevm/utils/type-aliases/extractabievent/)\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/)

## Defined in

[extensions/ethers/src/contract/TypesafeEthersContract.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L15)
