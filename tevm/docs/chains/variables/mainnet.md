[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / mainnet

# Variable: mainnet

> `const` **mainnet**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)

TODO update op-stack package to use this
export const tevmL2Devnet = createChainCommon(
defineChain({
id: 900,
name: 'tevm-devnet',
fees: _optimism.fees,
rpcUrls: foundry.rpcUrls,
testnet: true,
custom: foundry.custom,
})
)

## Source

packages/chains/types/index.d.ts:33
