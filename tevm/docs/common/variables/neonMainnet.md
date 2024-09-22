[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / neonMainnet

# Variable: neonMainnet

> `const` **neonMainnet**: `Common`

Creates a common configuration for the neonMainnet chain.

## Description

Chain ID: 245022934
Chain Name: Neon EVM MainNet
Default Block Explorer: https://neonscan.org
Default RPC URL: https://neon-proxy-mainnet.solana.p2p.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { neonMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: neonMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/neonMainnet.d.ts:21
