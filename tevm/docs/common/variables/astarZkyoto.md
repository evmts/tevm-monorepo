[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / astarZkyoto

# Variable: astarZkyoto

> `const` **astarZkyoto**: `Common`

Creates a common configuration for the astarZkyoto chain.

## Description

Chain ID: 6038361
Chain Name: Astar zkEVM Testnet zKyoto
Default Block Explorer: https://zkyoto.explorer.startale.com
Default RPC URL: https://rpc.startale.com/zkyoto

## Example

```ts
import { createMemoryClient } from 'tevm'
import { astarZkyoto } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: astarZkyoto,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/astarZkyoto.d.ts:21
