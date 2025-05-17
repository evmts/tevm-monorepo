[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / TypesafeEthersContract

# Type Alias: TypesafeEthersContract\<TAbi\>

> **TypesafeEthersContract**\<`TAbi`\> = `BaseContract` & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "pure" \| "view"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\]\> \} & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "nonpayable" \| "payable"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["outputs"\]\>\[0\], ContractTransactionResponse\> \} & `object`

Defined in: [extensions/ethers/src/contract/TypesafeEthersContract.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L15)

## Type declaration

### queryFilter()

> **queryFilter**: \<`TContractEventName`\>(`event`, `fromBlock?`, `toBlock?`) => `Promise`\<`TContractEventName` *extends* `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

#### Type Parameters

##### TContractEventName

`TContractEventName` *extends* `Omit`\<`ContractEventName`, `ExtractAbiEventNames`\<`TAbi`\>\> \| `ExtractAbiEventNames`\<`TAbi`\>

#### Parameters

##### event

`TContractEventName`

##### fromBlock?

`BlockTag`

##### toBlock?

`BlockTag`

#### Returns

`Promise`\<`TContractEventName` *extends* `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`
