[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mandala

# Variable: mandala

> `const` **mandala**: `Common`

Creates a common configuration for the mandala chain.

## Description

Chain ID: 595
Chain Name: Mandala TC9
Default Block Explorer: https://blockscout.mandala.aca-staging.network
Default RPC URL: https://eth-rpc-tc9.aca-staging.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mandala } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mandala,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mandala.d.ts:21
