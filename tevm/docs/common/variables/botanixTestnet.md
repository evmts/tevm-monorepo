[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / botanixTestnet

# Variable: botanixTestnet

> `const` **botanixTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/botanixTestnet.d.ts:21

Creates a common configuration for the botanixTestnet chain.

## Description

Chain ID: 3636
Chain Name: Botanix Testnet
Default Block Explorer: https://blockscout.botanixlabs.dev
Default RPC URL: https://poa-node.botanixlabs.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { botanixTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: botanixTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
