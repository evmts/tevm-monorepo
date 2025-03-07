[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / taikoKatla

# Variable: taikoKatla

> `const` **taikoKatla**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/taikoKatla.d.ts:21

Creates a common configuration for the taikoKatla chain.

## Description

Chain ID: 167008
Chain Name: Taiko Katla (Alpha-6 Testnet)
Default Block Explorer: https://explorer.katla.taiko.xyz
Default RPC URL: https://rpc.katla.taiko.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taikoKatla } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taikoKatla,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
