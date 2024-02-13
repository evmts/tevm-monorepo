**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ViemTevmOptimisticClient

# Type alias: ViemTevmOptimisticClient`<TChain, TAccount>`

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `object`

## Deprecated

in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` |
| `TAccount` extends `Account` \| `undefined` | `Account` \| `undefined` |

## Type declaration

### tevm

> **tevm**: `Omit`\<`TevmClient`, `"request"`\> & `object`

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

[ViemTevmOptimisticClient.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L17)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
