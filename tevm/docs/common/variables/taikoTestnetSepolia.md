[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / taikoTestnetSepolia

# Variable: taikoTestnetSepolia

> `const` **taikoTestnetSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/taikoTestnetSepolia.d.ts:21

Creates a common configuration for the taikoTestnetSepolia chain.

## Description

Chain ID: 167005
Chain Name: Taiko (Alpha-3 Testnet)
Default Block Explorer: https://explorer.test.taiko.xyz
Default RPC URL: https://rpc.test.taiko.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taikoTestnetSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taikoTestnetSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
