[**@tevm/chains**](../README.md) • **Docs**

***

[@tevm/chains](../globals.md) / mainnet

# Variable: mainnet

> `const` **mainnet**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)\<`object`\>

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

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.etherscan.io/api"`

### blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

### blockExplorers.default.url

> `readonly` **url**: `"https://etherscan.io"`

### contracts

> **contracts**: `object`

### contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

### contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

### contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

### contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xce01f8eee7E479C928F8919abD53E553a36CeF67"`

### contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `19258213`

### contracts.multicall3

> `readonly` **multicall3**: `object`

### contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

### contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14353601`

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

### fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

### formatters?

> `optional` **formatters**: `undefined`

### id

> **id**: `1`

### name

> **name**: `"Ethereum"`

### nativeCurrency

> **nativeCurrency**: `object`

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### rpcUrls

> **rpcUrls**: `object`

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"https://cloudflare-eth.com"`]

### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`\>

### sourceId?

> `optional` **sourceId**: `number`

### testnet?

> `optional` **testnet**: `boolean`

## Source

[packages/chains/src/index.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/chains/src/index.ts#L91)
