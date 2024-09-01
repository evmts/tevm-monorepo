---
editUrl: false
next: false
prev: false
title: "ViemTevmOptimisticClient"
---

> **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `object`

:::caution[Deprecated]
in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`
:::

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

• **TAccount** *extends* [`Account`](/reference/tevm/utils/type-aliases/account/) \| `undefined` = [`Account`](/reference/tevm/utils/type-aliases/account/) \| `undefined`

## Type declaration

### ~~tevm~~

> **tevm**: `Omit`\<[`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/), `"request"`\> & `object`

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Type declaration

##### ~~writeContractOptimistic()~~

###### Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* `string` = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TArgs** *extends* `unknown` = `ContractFunctionArgs`\<`TAbi`, `"nonpayable"` \| `"payable"`, `TFunctionName`\>

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined` \| `Chain`

###### Parameters

• **action**: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>

###### Returns

`AsyncGenerator`\<[`OptimisticResult`](/reference/tevm/viem/type-aliases/optimisticresult/)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>

## Defined in

[extensions/viem/src/ViemTevmOptimisticClient.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L11)
