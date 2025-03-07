[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / songbird

# Variable: songbird

> `const` **songbird**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/songbird.d.ts:21

Creates a common configuration for the songbird chain.

## Description

Chain ID: 19
Chain Name: Songbird Mainnet
Default Block Explorer: https://songbird-explorer.flare.network
Default RPC URL: https://songbird-api.flare.network/ext/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { songbird } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: songbird,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
