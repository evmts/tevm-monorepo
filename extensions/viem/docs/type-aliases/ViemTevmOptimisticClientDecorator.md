**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ViemTevmOptimisticClientDecorator

# Type alias: ViemTevmOptimisticClientDecorator

> **ViemTevmOptimisticClientDecorator**: \<`TTransport`, `TChain`, `TAccount`\>(`client`) => [`ViemTevmOptimisticClient`](ViemTevmOptimisticClient.md)\<`TChain`, `TAccount`\>

A viem decorator for `tevmViemExtension`

## Type parameters

▪ **TTransport** extends `Transport` = `Transport`

▪ **TChain** extends `Chain` \| `undefined` = `Chain` \| `undefined`

▪ **TAccount** extends `Account` \| `undefined` = `Account` \| `undefined`

## Parameters

▪ **client**: `Pick`\<`WalletClient`, `"request"` \| `"writeContract"`\>

## Source

[ViemTevmOptimisticClientDecorator.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
