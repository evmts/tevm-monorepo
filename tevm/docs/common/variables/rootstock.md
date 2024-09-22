[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / rootstock

# Variable: rootstock

> `const` **rootstock**: `Common`

Creates a common configuration for the rootstock chain.

## Description

Chain ID: 30
Chain Name: Rootstock Mainnet
Default Block Explorer: https://explorer.rsk.co
Default RPC URL: https://public-node.rsk.co

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rootstock } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rootstock,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/rootstock.d.ts:21
