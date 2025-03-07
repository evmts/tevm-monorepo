[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bitTorrent

# Variable: bitTorrent

> `const` **bitTorrent**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bitTorrent.d.ts:21

Creates a common configuration for the bitTorrent chain.

## Description

Chain ID: 199
Chain Name: BitTorrent
Default Block Explorer: https://bttcscan.com
Default RPC URL: https://rpc.bittorrentchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bitTorrent } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bitTorrent,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
