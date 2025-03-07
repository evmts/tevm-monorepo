[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zkLinkNovaSepoliaTestnet

# Variable: zkLinkNovaSepoliaTestnet

> `const` **zkLinkNovaSepoliaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zkLinkNovaSepoliaTestnet.d.ts:21

Creates a common configuration for the zkLinkNovaSepoliaTestnet chain.

## Description

Chain ID: 810181
Chain Name: zkLink Nova Sepolia Testnet
Default Block Explorer: https://sepolia.explorer.zklink.io
Default RPC URL: https://sepolia.rpc.zklink.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zkLinkNovaSepoliaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zkLinkNovaSepoliaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
