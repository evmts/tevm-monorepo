[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / flare

# Variable: flare

> `const` **flare**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/flare.d.ts:21

Creates a common configuration for the flare chain.

## Description

Chain ID: 14
Chain Name: Flare Mainnet
Default Block Explorer: https://flare-explorer.flare.network
Default RPC URL: https://flare-api.flare.network/ext/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { flare } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: flare,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
