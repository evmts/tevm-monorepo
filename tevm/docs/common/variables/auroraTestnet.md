[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / auroraTestnet

# Variable: auroraTestnet

> `const` **auroraTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/auroraTestnet.d.ts:21

Creates a common configuration for the auroraTestnet chain.

## Description

Chain ID: 1313161555
Chain Name: Aurora Testnet
Default Block Explorer: https://testnet.aurorascan.dev
Default RPC URL: https://testnet.aurora.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { auroraTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: auroraTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
