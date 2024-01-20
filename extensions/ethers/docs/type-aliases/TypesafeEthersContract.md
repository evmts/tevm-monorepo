**@tevm/ethers** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TypesafeEthersContract

# Type alias: TypesafeEthersContract`<TAbi>`

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

[extensions/ethers/src/TypesafeEthersContract.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TypesafeEthersContract.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
