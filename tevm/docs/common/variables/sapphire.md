[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sapphire

# Variable: sapphire

> `const` **sapphire**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sapphire.d.ts:21

Creates a common configuration for the sapphire chain.

## Description

Chain ID: 23294
Chain Name: Oasis Sapphire
Default Block Explorer: https://explorer.oasis.io/mainnet/sapphire
Default RPC URL: https://sapphire.oasis.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sapphire } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sapphire,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
