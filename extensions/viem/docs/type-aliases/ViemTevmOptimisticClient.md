[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / ViemTevmOptimisticClient

# Type alias: ~~ViemTevmOptimisticClient\<TChain, TAccount\>~~

`Experimental`

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `object`

## Deprecated

in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`

## Type parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

## Type declaration

### ~~tevm~~

> **tevm**: `Omit`\<`TevmClient`, `"request"`\> & `object`

#### Type declaration

##### ~~writeContractOptimistic()~~

###### Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `string` = `ContractFunctionName`\<`TAbi`\>

• **TArgs** *extends* `unknown` = `ContractFunctionArgs`\<`TAbi`, `"nonpayable"` \| `"payable"`, `TFunctionName`\>

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined` \| `Chain`

###### Parameters

• **action**: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>

###### Returns

`AsyncGenerator`\<[`OptimisticResult`](OptimisticResult.md)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>

## Source

[extensions/viem/src/ViemTevmOptimisticClient.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L11)
