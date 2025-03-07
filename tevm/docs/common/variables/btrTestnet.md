[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / btrTestnet

# Variable: btrTestnet

> `const` **btrTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/btrTestnet.d.ts:21

Creates a common configuration for the btrTestnet chain.

## Description

Chain ID: 200810
Chain Name: Bitlayer Testnet
Default Block Explorer: https://testnet.btrscan.com
Default RPC URL: https://testnet-rpc.bitlayer.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { btrTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: btrTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
