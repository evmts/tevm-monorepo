[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / apexTestnet

# Variable: apexTestnet

> `const` **apexTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/apexTestnet.d.ts:21

Creates a common configuration for the apexTestnet chain.

## Description

Chain ID: 3993
Chain Name: APEX Testnet
Default Block Explorer: https://exp-testnet.apexlayer.xyz
Default RPC URL: https://rpc-testnet.apexlayer.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { apexTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: apexTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
