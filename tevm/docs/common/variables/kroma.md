[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / kroma

# Variable: kroma

> `const` **kroma**: `Common`

Creates a common configuration for the kroma chain.

## Description

Chain ID: 255
Chain Name: Kroma
Default Block Explorer: https://blockscout.kroma.network
Default RPC URL: https://api.kroma.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kroma } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kroma,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/kroma.d.ts:21
