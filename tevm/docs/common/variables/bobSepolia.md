[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bobSepolia

# Variable: bobSepolia

> `const` **bobSepolia**: `Common`

Creates a common configuration for the bobSepolia chain.

## Description

Chain ID: 808813
Chain Name: BOB Sepolia
Default Block Explorer: https://bob-sepolia.explorer.gobob.xyz
Default RPC URL: https://bob-sepolia.rpc.gobob.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bobSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bobSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bobSepolia.d.ts:21
