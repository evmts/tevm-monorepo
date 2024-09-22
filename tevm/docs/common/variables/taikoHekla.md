[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / taikoHekla

# Variable: taikoHekla

> `const` **taikoHekla**: `Common`

Creates a common configuration for the taikoHekla chain.

## Description

Chain ID: 167009
Chain Name: Taiko Hekla L2
Default Block Explorer: https://hekla.taikoscan.network
Default RPC URL: https://rpc.hekla.taiko.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taikoHekla } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taikoHekla,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/taikoHekla.d.ts:21
