[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / ViemTevmOptimisticClient

# ~~Type Alias: ViemTevmOptimisticClient\<TChain, TAccount\>~~

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\> = `object`

Defined in: [extensions/viem/src/ViemTevmOptimisticClient.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L11)

**`Experimental`**

## Deprecated

in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`

## Type Parameters

### TChain

`TChain` *extends* `Chain` \| `undefined` = `Chain`

### TAccount

`TAccount` *extends* `Account` \| `undefined` = `Account` \| `undefined`

## Properties

### ~~tevm~~

> **tevm**: `Omit`\<`TevmClient`, `"request"`\> & `object`

Defined in: [extensions/viem/src/ViemTevmOptimisticClient.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L15)

#### Type Declaration

##### ~~writeContractOptimistic()~~

> **writeContractOptimistic**\<`TAbi`, `TFunctionName`, `TArgs`, `TChainOverride`\>(`action`): `AsyncGenerator`\<[`OptimisticResult`](OptimisticResult.md)\<`TAbi`, `TFunctionName`, `TChain`\>\>

###### Type Parameters

###### TAbi

`TAbi` *extends* `Abi` \| readonly `unknown`[] = `Abi`

###### TFunctionName

`TFunctionName` *extends* `string` = `ContractFunctionName`\<`TAbi`\>

###### TArgs

`TArgs` *extends* `unknown` = `ContractFunctionArgs`\<`TAbi`, `"nonpayable"` \| `"payable"`, `TFunctionName`\>

###### TChainOverride

`TChainOverride` *extends* `undefined` \| `Chain` = `undefined` \| `Chain`

###### Parameters

###### action

`WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>

###### Returns

`AsyncGenerator`\<[`OptimisticResult`](OptimisticResult.md)\<`TAbi`, `TFunctionName`, `TChain`\>\>
