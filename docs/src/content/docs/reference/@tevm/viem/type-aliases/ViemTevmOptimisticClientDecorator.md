---
editUrl: false
next: false
prev: false
title: "ViemTevmOptimisticClientDecorator"
---

`Experimental`

> **ViemTevmOptimisticClientDecorator**: \<`TTransport`, `TChain`, `TAccount`\>(`client`) => [`ViemTevmOptimisticClient`](/reference/tevm/viem/type-aliases/viemtevmoptimisticclient/)\<`TChain`, `TAccount`\>

:::caution[Deprecated]
in favor of the viem transport

A viem decorator for `tevmViemExtension`
:::

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type parameters

• **TTransport** *extends* `Transport` = `Transport`

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

## Parameters

• **client**: `Pick`\<`WalletClient`, `"request"` \| `"writeContract"`\>

## Returns

[`ViemTevmOptimisticClient`](/reference/tevm/viem/type-aliases/viemtevmoptimisticclient/)\<`TChain`, `TAccount`\>

## Source

[extensions/viem/src/ViemTevmOptimisticClientDecorator.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L9)
