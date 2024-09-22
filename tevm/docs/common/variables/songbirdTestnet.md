[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / songbirdTestnet

# Variable: songbirdTestnet

> `const` **songbirdTestnet**: `Common`

Creates a common configuration for the songbirdTestnet chain.

## Description

Chain ID: 16
Chain Name: Coston
Default Block Explorer: https://coston-explorer.flare.network
Default RPC URL: https://coston-api.flare.network/ext/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { songbirdTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: songbirdTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/songbirdTestnet.d.ts:21
