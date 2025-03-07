[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bitTorrentTestnet

# Variable: bitTorrentTestnet

> `const` **bitTorrentTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bitTorrentTestnet.d.ts:21

Creates a common configuration for the bitTorrentTestnet chain.

## Description

Chain ID: 1028
Chain Name: BitTorrent Chain Testnet
Default Block Explorer: https://testnet.bttcscan.com
Default RPC URL: https://testrpc.bittorrentchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bitTorrentTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bitTorrentTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
