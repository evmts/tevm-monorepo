[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / zoraTestnet

# Variable: zoraTestnet

> `const` **zoraTestnet**: `Common`

Creates a common configuration for the zoraTestnet chain.

## Description

Chain ID: 999
Chain Name: Zora Goerli Testnet
Default Block Explorer: https://testnet.explorer.zora.energy
Default RPC URL: https://testnet.rpc.zora.energy

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zoraTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zoraTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/zoraTestnet.d.ts:21
