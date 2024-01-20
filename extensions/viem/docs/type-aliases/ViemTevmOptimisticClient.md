**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ViemTevmOptimisticClient

# Type alias: ViemTevmOptimisticClient`<TChain, TAccount>`

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` |
| `TAccount` extends `Account` \| `undefined` | `Account` \| `undefined` |

## Type declaration

### tevm

> **tevm**: `Omit`\<`Tevm`, `"request"`\> & `object`

#### Type declaration

##### writeContractOptimistic()

###### Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `string` = `ContractFunctionName`\<`TAbi`\>

▪ **TArgs** extends `unknown` = `ContractFunctionArgs`\<`TAbi`, `"nonpayable"` \| `"payable"`, `TFunctionName`\>

▪ **TChainOverride** extends `undefined` \| `Chain` = `undefined` \| `Chain`

###### Parameters

▪ **action**: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>

## Source

[ViemTevmOptimisticClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
