[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / TypesafeEthersContract

# Type Alias: TypesafeEthersContract\<TAbi\>

> **TypesafeEthersContract**\<`TAbi`\> = `BaseContract` & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "pure" \| "view"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, EthersFunctionOutput\<TAbi, TFunctionName\>\> \} & \{ \[TFunctionName in ExtractAbiFunctionNames\<TAbi, "nonpayable" \| "payable"\>\]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>\["inputs"\]\> & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, ContractTransactionResponse\> \} & `object`

Defined in: [extensions/ethers/src/contract/TypesafeEthersContract.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L62)

## Type Declaration

### queryFilter

> **queryFilter**: \<`TContractEventName`\>(`event`, `fromBlock?`, `toBlock?`) => `Promise`\<`TContractEventName` *extends* `ExtractAbiEventNames`\<`TAbi`\> ? `EthersEventLog`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

#### Type Parameters

| Type Parameter |
| ------ |
| `TContractEventName` *extends* `Omit`\<`ContractEventName`, `ExtractAbiEventNames`\<`TAbi`\>\> \| `ExtractAbiEventNames`\<`TAbi`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `TContractEventName` |
| `fromBlock?` | `BlockTag` |
| `toBlock?` | `BlockTag` |

#### Returns

`Promise`\<`TContractEventName` *extends* `ExtractAbiEventNames`\<`TAbi`\> ? `EthersEventLog`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>

## Type Parameters

| Type Parameter |
| ------ |
| `TAbi` *extends* `Abi` |
