[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / ViemTevmOptimisticClientDecorator

# ~~Type Alias: ViemTevmOptimisticClientDecorator~~

> **ViemTevmOptimisticClientDecorator** = \<`TTransport`, `TChain`, `TAccount`\>(`client`) => [`ViemTevmOptimisticClient`](ViemTevmOptimisticClient.md)\<`TChain`, `TAccount`\>

Defined in: [extensions/viem/src/ViemTevmOptimisticClientDecorator.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L9)

**`Experimental`**

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTransport` *extends* `Transport` | `Transport` |
| `TChain` *extends* `Chain` \| `undefined` | `Chain` \| `undefined` |
| `TAccount` *extends* `Account` \| `undefined` | `Account` \| `undefined` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `Pick`\<`WalletClient`, `"request"` \| `"writeContract"`\> |

## Returns

[`ViemTevmOptimisticClient`](ViemTevmOptimisticClient.md)\<`TChain`, `TAccount`\>

## Deprecated

in favor of the viem transport

A viem decorator for `tevmViemExtension`
