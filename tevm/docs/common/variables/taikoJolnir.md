[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / taikoJolnir

# Variable: taikoJolnir

> `const` **taikoJolnir**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/taikoJolnir.d.ts:21

Creates a common configuration for the taikoJolnir chain.

## Description

Chain ID: 167007
Chain Name: Taiko Jolnir (Alpha-5 Testnet)
Default Block Explorer: https://explorer.jolnir.taiko.xyz
Default RPC URL: https://rpc.jolnir.taiko.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taikoJolnir } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taikoJolnir,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
