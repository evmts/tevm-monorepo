[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / mevTestnet

# Variable: mevTestnet

> `const` **mevTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/mevTestnet.d.ts:21

Creates a common configuration for the mevTestnet chain.

## Description

Chain ID: 4759
Chain Name: MEVerse Chain Testnet
Default Block Explorer: https://testnet.meversescan.io/
Default RPC URL: https://rpc.meversetestnet.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mevTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mevTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
