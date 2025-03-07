[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / playfiAlbireo

# Variable: playfiAlbireo

> `const` **playfiAlbireo**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/playfiAlbireo.d.ts:21

Creates a common configuration for the playfiAlbireo chain.

## Description

Chain ID: 1612127
Chain Name: PlayFi Albireo Testnet
Default Block Explorer: https://albireo-explorer.playfi.ai
Default RPC URL: https://albireo-rpc.playfi.ai

## Example

```ts
import { createMemoryClient } from 'tevm'
import { playfiAlbireo } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: playfiAlbireo,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
