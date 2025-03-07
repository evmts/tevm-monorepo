[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / ViemTevmOptimisticClient

# Type Alias: ~~ViemTevmOptimisticClient\<TChain, TAccount\>~~

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `object`

Defined in: [extensions/viem/src/ViemTevmOptimisticClient.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L11)

**`Experimental`**

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

## Type declaration

### ~~tevm~~

> **tevm**: `Omit`\<`TevmClient`, `"request"`\> & `object`

#### Type declaration

##### ~~writeContractOptimistic()~~

###### Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `string` = `ContractFunctionName`\<`TAbi`\>

• **TArgs** *extends* `unknown` = `ContractFunctionArgs`\<`TAbi`, `"nonpayable"` \| `"payable"`, `TFunctionName`\>

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined` \| `Chain`

###### Parameters

###### action

`WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>

###### Returns

`AsyncGenerator`\<[`OptimisticResult`](OptimisticResult.md)\<`TAbi`, `TFunctionName`, `TChain`\>\>

## Deprecated

in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`
