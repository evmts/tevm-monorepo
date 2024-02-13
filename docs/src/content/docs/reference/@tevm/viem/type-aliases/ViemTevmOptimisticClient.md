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

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` |
| `TAccount` extends `Account` \| `undefined` | `Account` \| `undefined` |

## Type declaration

### tevm

> **tevm**: `Omit`\<[`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/), `"request"`\> & `object`

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
