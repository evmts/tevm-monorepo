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

| Type Parameter | Default type |
| ------ | ------ |
| `TChain` *extends* `Chain` \| `undefined` | `Chain` |
| `TAccount` *extends* `Account` \| `undefined` | `Account` \| `undefined` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="tevm"></a> ~~`tevm`~~ | `Omit`\<`TevmClient`, `"request"`\> & `object` | [extensions/viem/src/ViemTevmOptimisticClient.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L15) |
