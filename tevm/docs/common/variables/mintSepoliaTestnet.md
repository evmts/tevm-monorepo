[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mintSepoliaTestnet

# Variable: mintSepoliaTestnet

> `const` **mintSepoliaTestnet**: `Common`

Creates a common configuration for the mintSepoliaTestnet chain.

## Description

Chain ID: 1686
Chain Name: Mint Sepolia Testnet
Default Block Explorer: https://testnet-explorer.mintchain.io
Default RPC URL: https://testnet-rpc.mintchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mintSepoliaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mintSepoliaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mintSepoliaTestnet.d.ts:21
